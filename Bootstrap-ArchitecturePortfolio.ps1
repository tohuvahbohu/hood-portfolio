#Requires -Version 7.0
<#
.SYNOPSIS
  Bootstrap, validate, and deploy the Michael Andrew Hood architecture portfolio.

.DESCRIPTION
  Production-oriented orchestration for dependency checks, GitHub repository setup,
  npm build/validation, GitHub Pages configuration, and optional Cloudflare DNS.

  Never logs tokens or credentials. Safe to re-run (idempotent where practical).

.EXAMPLE
  .\Bootstrap-ArchitecturePortfolio.ps1 -WhatIf
  .\Bootstrap-ArchitecturePortfolio.ps1 -OpenBrowser
  .\Bootstrap-ArchitecturePortfolio.ps1 -ConfigureCloudflare
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$ProjectRoot = $PSScriptRoot,
    [string]$GitHubOwner = "",
    [string]$RepoName = "",
    [string]$CustomDomain = "michaelandrewhood.com",
    [switch]$ConfigureCloudflare,
    [switch]$SkipDependencyInstall,
    [switch]$SkipDeploy,
    [switch]$NonInteractive,
    [switch]$Force,
    [switch]$OpenBrowser
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
$script:LogDir = Join-Path $ProjectRoot "logs"
if (-not (Test-Path $script:LogDir)) {
    New-Item -ItemType Directory -Path $script:LogDir -Force | Out-Null
}
$script:LogFile = Join-Path $script:LogDir ("bootstrap-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))
$script:ExitCode = 0
$script:Completed = [System.Collections.Generic.List[string]]::new()
$script:Warnings = [System.Collections.Generic.List[string]]::new()
$script:ManualActions = [System.Collections.Generic.List[string]]::new()

function Write-Log {
    param(
        [ValidateSet("INFO", "SUCCESS", "WARN", "ERROR", "DEBUG")]
        [string]$Severity,
        [string]$Step,
        [string]$Message
    )
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[{0}] [{1}] [{2}] {3}" -f $ts, $Severity, $Step, $Message
    switch ($Severity) {
        "ERROR" { Write-Host $line -ForegroundColor Red }
        "WARN" { Write-Host $line -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $line -ForegroundColor Green }
        "DEBUG" { if ($VerbosePreference -ne "SilentlyContinue") { Write-Host $line -ForegroundColor DarkGray } }
        default { Write-Host $line }
    }
    Add-Content -Path $script:LogFile -Value $line
}

function Invoke-External {
    param(
        [string]$FilePath,
        [string[]]$ArgumentList = @(),
        [string]$Step,
        [string]$SuggestedAction = "Review the command output and retry."
    )
    Write-Log -Severity DEBUG -Step $Step -Message ("Running: {0} {1}" -f $FilePath, ($ArgumentList -join " "))
    $stdout = & $FilePath @ArgumentList 2>&1
    $code = $LASTEXITCODE
    $text = ($stdout | Out-String)
    if ($code -ne 0) {
        Write-Log -Severity ERROR -Step $Step -Message ("Command failed: {0}" -f $FilePath)
        Write-Log -Severity ERROR -Step $Step -Message ("Exit code: {0}" -f $code)
        Write-Log -Severity ERROR -Step $Step -Message ("CWD: {0}" -f (Get-Location))
        if ($text) { Write-Log -Severity ERROR -Step $Step -Message ("Output: {0}" -f $text.Trim()) }
        Write-Log -Severity ERROR -Step $Step -Message ("Suggested action: {0}" -f $SuggestedAction)
        throw ("{0} failed with exit code {1}" -f $FilePath, $code)
    }
    return $text
}

function Test-CommandExists {
    param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

# ---------------------------------------------------------------------------
# Dependency checks
# ---------------------------------------------------------------------------
function Test-Dependencies {
    Write-Log -Severity INFO -Step "Dependencies" -Message "Checking environment dependencies"

    if ($PSVersionTable.PSVersion.Major -lt 7) {
        throw "PowerShell 7+ is required. Install with: winget install Microsoft.PowerShell"
    }
    Write-Log -Severity SUCCESS -Step "Dependencies" -Message ("PowerShell {0}" -f $PSVersionTable.PSVersion)

    $required = @(
        @{ Name = "git"; MinHint = "2.40+"; Winget = "Git.Git" },
        @{ Name = "gh"; MinHint = "2.40+"; Winget = "GitHub.cli" },
        @{ Name = "node"; MinHint = "22.12+"; Winget = "OpenJS.NodeJS.22" },
        @{ Name = "npm"; MinHint = "10+"; Winget = "OpenJS.NodeJS.22" }
    )

    foreach ($dep in $required) {
        if (-not (Test-CommandExists $dep.Name)) {
            if ($SkipDependencyInstall) {
                throw ("Missing dependency '{0}'. Install manually, then re-run." -f $dep.Name)
            }
            if ($NonInteractive -and -not $Force) {
                throw ("Missing dependency '{0}' and -NonInteractive was set without -Force." -f $dep.Name)
            }
            if (Test-CommandExists "winget") {
                Write-Log -Severity WARN -Step "Dependencies" -Message ("Installing {0} via winget ({1})" -f $dep.Name, $dep.Winget)
                if ($PSCmdlet.ShouldProcess($dep.Winget, "winget install")) {
                    & winget install $dep.Winget --accept-package-agreements --accept-source-agreements --disable-interactivity
                    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
                    [System.Environment]::GetEnvironmentVariable("Path", "User")
                }
            }
            else {
                throw ("Missing '{0}'. Install with winget package {1} (requires ~{2})." -f $dep.Name, $dep.Winget, $dep.MinHint)
            }
        }
        if (-not (Test-CommandExists $dep.Name)) {
            throw ("Dependency '{0}' still missing after install attempt." -f $dep.Name)
        }
        $ver = & $dep.Name --version 2>&1 | Select-Object -First 1
        Write-Log -Severity SUCCESS -Step "Dependencies" -Message ("{0}: {1}" -f $dep.Name, $ver)
    }

    # Network checks (best effort)
    foreach ($uri in @("https://github.com", "https://registry.npmjs.org")) {
        try {
            $null = Invoke-WebRequest -Uri $uri -Method Head -TimeoutSec 15 -UseBasicParsing
            Write-Log -Severity SUCCESS -Step "Network" -Message ("Reachable: {0}" -f $uri)
        }
        catch {
            Write-Log -Severity WARN -Step "Network" -Message ("Could not reach {0}: {1}" -f $uri, $_.Exception.Message)
            $script:Warnings.Add("Network check failed for $uri")
        }
    }
    $script:Completed.Add("Dependency checks")
}

# ---------------------------------------------------------------------------
# GitHub auth + repo
# ---------------------------------------------------------------------------
function Test-GitHubApiAuth {
    $login = & gh api user --jq .login 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $login -or $login -match "Bad credentials|message") {
        return $false
    }
    return $true
}

function Ensure-GitHubAuth {
    Write-Log -Severity INFO -Step "GitHubAuth" -Message "Checking gh authentication"
    $ok = Test-GitHubApiAuth
    if (-not $ok) {
        if ($WhatIfPreference) {
            throw "GitHub CLI token is missing or invalid. Run: gh auth login -h github.com  (WhatIf cannot complete auth.)"
        }
        if ($NonInteractive) {
            throw "GitHub CLI is not authenticated. Run: gh auth login -h github.com"
        }
        Write-Log -Severity INFO -Step "GitHubAuth" -Message "Starting interactive gh auth login"
        if ($PSCmdlet.ShouldProcess("github.com", "gh auth login")) {
            & gh auth login -h github.com -p https -w
            if ($LASTEXITCODE -ne 0) { throw "GitHub authentication failed." }
        }
        if (-not (Test-GitHubApiAuth)) {
            throw "GitHub authentication did not produce a working API token. Re-run: gh auth login -h github.com"
        }
    }
    $status = & gh auth status 2>&1 | Out-String
    Write-Log -Severity SUCCESS -Step "GitHubAuth" -Message "Authenticated with GitHub CLI"
    Write-Log -Severity DEBUG -Step "GitHubAuth" -Message $status.Trim()
    $script:Completed.Add("GitHub authentication")
}

function Get-GitHubUsername {
    $login = (& gh api user --jq .login 2>$null)
    if ($LASTEXITCODE -ne 0 -or -not $login) {
        throw "Unable to determine GitHub username via gh api user. Run: gh auth login -h github.com"
    }
    $login = $login.Trim()
    if ($login -match "[{}]|Bad credentials|message") {
        throw "GitHub API returned an error instead of a username. Re-authenticate with: gh auth login -h github.com"
    }
    return $login
}

function Ensure-Repository {
    param([string]$Owner, [string]$Name)

    Write-Log -Severity INFO -Step "Repository" -Message ("Ensuring repository {0}/{1}" -f $Owner, $Name)
    $exists = $false
    & gh repo view "$Owner/$Name" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { $exists = $true }

    if ($exists) {
        Write-Log -Severity INFO -Step "Repository" -Message "Repository already exists"
        if (-not $Force) {
            Write-Log -Severity WARN -Step "Repository" -Message "Existing repo will not be force-overwritten. Use -Force only if intentional."
        }
    }
    else {
        if ($PSCmdlet.ShouldProcess("$Owner/$Name", "Create public GitHub repository")) {
            Invoke-External -FilePath "gh" -ArgumentList @(
                "repo", "create", "$Owner/$Name", "--public", "--description",
                "Architecture portfolio for Michael Andrew Hood", "--disable-wiki", "--disable-issues"
            ) -Step "Repository" -SuggestedAction "Create the repository manually on GitHub, then re-run."
            Write-Log -Severity SUCCESS -Step "Repository" -Message "Created repository"
        }
    }

    Push-Location $ProjectRoot
    try {
        if (-not (Test-Path (Join-Path $ProjectRoot ".git"))) {
            if ($PSCmdlet.ShouldProcess($ProjectRoot, "git init")) {
                Invoke-External -FilePath "git" -ArgumentList @("init", "-b", "main") -Step "Git"
            }
        }
        $remoteUrl = "https://github.com/$Owner/$Name.git"
        if ($PSCmdlet.ShouldProcess($remoteUrl, "Configure git remote origin")) {
            $remotes = & git remote 2>&1
            if ($remotes -match "origin") {
                Invoke-External -FilePath "git" -ArgumentList @("remote", "set-url", "origin", $remoteUrl) -Step "Git"
            }
            else {
                Invoke-External -FilePath "git" -ArgumentList @("remote", "add", "origin", $remoteUrl) -Step "Git"
            }
            Write-Log -Severity SUCCESS -Step "Repository" -Message ("Remote origin → {0}" -f $remoteUrl)
        }
        else {
            Write-Log -Severity INFO -Step "Repository" -Message ("WhatIf: would set origin to {0}" -f $remoteUrl)
        }
    }
    finally {
        Pop-Location
    }
    $script:Completed.Add("Repository ready: $Owner/$Name")
    return "https://github.com/$Owner/$Name"
}

# ---------------------------------------------------------------------------
# Build / validate
# ---------------------------------------------------------------------------
function Invoke-SiteBuild {
    Write-Log -Severity INFO -Step "Build" -Message "Installing dependencies and building site"
    Push-Location $ProjectRoot
    try {
        if (-not $SkipDependencyInstall) {
            if ($PSCmdlet.ShouldProcess("npm ci", "Install npm dependencies")) {
                if (Test-Path (Join-Path $ProjectRoot "package-lock.json")) {
                    Invoke-External -FilePath "npm" -ArgumentList @("ci") -Step "npm ci" -SuggestedAction "Delete node_modules and retry npm ci."
                }
                else {
                    Invoke-External -FilePath "npm" -ArgumentList @("install") -Step "npm install"
                }
            }
        }
        if ($PSCmdlet.ShouldProcess("validate", "Run format/check/validate/build")) {
            Invoke-External -FilePath "npm" -ArgumentList @("run", "format:check") -Step "format" -SuggestedAction "Run npm run format"
            Invoke-External -FilePath "npm" -ArgumentList @("run", "check") -Step "check" -SuggestedAction "Fix TypeScript/Astro errors"
            Invoke-External -FilePath "npm" -ArgumentList @("run", "validate") -Step "validate"
            Invoke-External -FilePath "npm" -ArgumentList @("run", "build") -Step "build"
        }
        Write-Log -Severity SUCCESS -Step "Build" -Message "Build and validation succeeded"
        $script:Completed.Add("Local build + validation")
    }
    finally {
        Pop-Location
    }
}

function Invoke-GitPublish {
    param([string]$Owner, [string]$Name)

    if ($SkipDeploy) {
        Write-Log -Severity WARN -Step "Deploy" -Message "Skipping deploy (-SkipDeploy)"
        return
    }

    Push-Location $ProjectRoot
    try {
        # Ensure private-interview is ignored
        $ignored = & git check-ignore -v private-interview 2>&1
        if ($LASTEXITCODE -ne 0 -and (Test-Path "private-interview")) {
            throw "private-interview/ is not ignored by git. Aborting publish."
        }

        if ($PSCmdlet.ShouldProcess("git commit/push", "Publish site to origin/main")) {
            & git add -A
            # Unstage private interview if somehow added
            & git reset -- private-interview 2>$null
            $status = & git status --porcelain
            if ($status) {
                $msg = "Publish architecture portfolio site"
                & git commit -m $msg
                if ($LASTEXITCODE -ne 0) { throw "git commit failed" }
            }
            else {
                Write-Log -Severity INFO -Step "Deploy" -Message "No local changes to commit"
            }
            Invoke-External -FilePath "git" -ArgumentList @("push", "-u", "origin", "main") -Step "git push" `
                -SuggestedAction "Ensure you have push permission and gh auth is valid."
            Write-Log -Severity SUCCESS -Step "Deploy" -Message "Pushed to origin/main"
            $script:Completed.Add("Pushed to GitHub")
        }
    }
    finally {
        Pop-Location
    }
}

function Set-GitHubPages {
    param([string]$Owner, [string]$Name, [string]$Domain)

    Write-Log -Severity INFO -Step "Pages" -Message "Configuring GitHub Pages (Actions)"
    if ($PSCmdlet.ShouldProcess("$Owner/$Name", "Configure GitHub Pages")) {
        # Enable pages via API — Actions build type
        $body = @{
            build_type = "workflow"
            source      = @{
                branch = "main"
                path   = "/"
            }
        } | ConvertTo-Json -Compress

        try {
            $temp = New-TemporaryFile
            Set-Content -Path $temp -Value $body -Encoding utf8
            & gh api -X POST "repos/$Owner/$Name/pages" --input $temp 2>&1 | Out-Null
            Remove-Item $temp -Force -ErrorAction SilentlyContinue
        }
        catch {
            Write-Log -Severity DEBUG -Step "Pages" -Message "Pages may already exist; attempting PATCH"
        }

        try {
            $cnameBody = @{ cname = $Domain; source = @{ branch = "main"; path = "/" } } | ConvertTo-Json -Compress
            # Prefer workflow-driven pages; set custom domain
            & gh api -X PUT "repos/$Owner/$Name/pages" -f "cname=$Domain" -f "build_type=workflow" 2>&1 | Out-Null
        }
        catch {
            Write-Log -Severity WARN -Step "Pages" -Message "Could not fully configure Pages via API. Set source to GitHub Actions in repo Settings → Pages."
            $script:ManualActions.Add("In GitHub → Settings → Pages: set Source to GitHub Actions and custom domain to $Domain")
        }

        Write-Log -Severity SUCCESS -Step "Pages" -Message "Pages configuration requested"
        $script:Completed.Add("GitHub Pages configuration requested")
    }
}

# ---------------------------------------------------------------------------
# Cloudflare
# ---------------------------------------------------------------------------
function Show-CloudflareChecklist {
    param([string]$Owner, [string]$Domain)

    $pagesHost = "$Owner.github.io"
    Write-Log -Severity INFO -Step "Cloudflare" -Message "Guided manual Cloudflare DNS checklist"
    $checklist = @"

Cloudflare DNS checklist for $Domain
====================================
GitHub Pages host: $pagesHost

1. In Cloudflare DNS for $Domain, create (DNS only / grey cloud initially):
   - Type: CNAME | Name: @  | Target: $pagesHost  (CNAME flattening at apex)
   - Type: CNAME | Name: www | Target: $pagesHost

2. Avoid hardcoding stale GitHub Pages A records when CNAME flattening is available.

3. In GitHub repo Settings → Pages:
   - Source: GitHub Actions
   - Custom domain: $Domain
   - Wait for DNS check + certificate
   - Then enable "Enforce HTTPS"

4. After cert issuance, you may enable Cloudflare proxy (orange cloud) if desired.
   Start DNS-only for simpler certificate issuance.

5. Verify:
   Resolve-DnsName $Domain
   Resolve-DnsName www.$Domain

"@
    Write-Host $checklist
    $script:ManualActions.Add("Complete Cloudflare DNS records for $Domain → $pagesHost")
    $script:ManualActions.Add("Enable Enforce HTTPS in GitHub Pages after certificate provisioning")
}

function Set-CloudflareDns {
    param([string]$Owner, [string]$Domain)

    $token = $env:CLOUDFLARE_API_TOKEN
    if (-not $token) {
        Write-Log -Severity WARN -Step "Cloudflare" -Message "CLOUDFLARE_API_TOKEN not set; printing manual checklist only"
        Show-CloudflareChecklist -Owner $Owner -Domain $Domain
        return
    }
    if (-not $ConfigureCloudflare) {
        Write-Log -Severity INFO -Step "Cloudflare" -Message "Token present but -ConfigureCloudflare not set; skipping API changes"
        Show-CloudflareChecklist -Owner $Owner -Domain $Domain
        return
    }

    Write-Log -Severity INFO -Step "Cloudflare" -Message "Configuring DNS via Cloudflare API (token redacted)"
    $headers = @{
        Authorization  = "Bearer $token"
        "Content-Type" = "application/json"
    }

    $zones = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones?name=$Domain" -Headers $headers
    if (-not $zones.success -or $zones.result.Count -lt 1) {
        throw "Could not find Cloudflare zone for $Domain. Check token scope (Zone Read)."
    }
    $zoneId = $zones.result[0].id
    $target = "$Owner.github.io"
    $records = @(
        @{ name = $Domain; type = "CNAME"; content = $target },
        @{ name = "www.$Domain"; type = "CNAME"; content = $target }
    )

    foreach ($rec in $records) {
        $listUri = "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records?type=$($rec.type)&name=$($rec.name)"
        $existing = Invoke-RestMethod -Uri $listUri -Headers $headers
        $bodyObj = @{
            type    = $rec.type
            name    = $rec.name
            content = $rec.content
            ttl     = 1
            proxied = $false
        }
        $body = $bodyObj | ConvertTo-Json -Compress
        if ($existing.result.Count -gt 0) {
            $id = $existing.result[0].id
            if ($PSCmdlet.ShouldProcess($rec.name, "Update Cloudflare DNS record")) {
                $null = Invoke-RestMethod -Method PUT -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records/$id" -Headers $headers -Body $body
                Write-Log -Severity SUCCESS -Step "Cloudflare" -Message ("Updated {0} → {1} (DNS only)" -f $rec.name, $rec.content)
            }
        }
        else {
            if ($PSCmdlet.ShouldProcess($rec.name, "Create Cloudflare DNS record")) {
                $null = Invoke-RestMethod -Method POST -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records" -Headers $headers -Body $body
                Write-Log -Severity SUCCESS -Step "Cloudflare" -Message ("Created {0} → {1} (DNS only)" -f $rec.name, $rec.content)
            }
        }
    }

    try {
        Resolve-DnsName $Domain -ErrorAction SilentlyContinue | Out-Null
        Write-Log -Severity INFO -Step "Cloudflare" -Message "DNS resolution attempted for $Domain (propagation may lag)"
    }
    catch {
        $script:Warnings.Add("DNS not yet resolvable for $Domain")
    }
    $script:Completed.Add("Cloudflare DNS API updates")
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
try {
    Write-Log -Severity INFO -Step "Start" -Message "Bootstrap-ArchitecturePortfolio starting"
    Write-Log -Severity INFO -Step "Start" -Message ("ProjectRoot={0}" -f $ProjectRoot)
    Write-Log -Severity INFO -Step "Start" -Message ("LogFile={0}" -f $script:LogFile)

    if (-not (Test-Path $ProjectRoot)) {
        if ($PSCmdlet.ShouldProcess($ProjectRoot, "Create project directory")) {
            New-Item -ItemType Directory -Path $ProjectRoot -Force | Out-Null
        }
    }

    Test-Dependencies
    Ensure-GitHubAuth

    if (-not $GitHubOwner) { $GitHubOwner = Get-GitHubUsername }
    if (-not $RepoName) { $RepoName = "$GitHubOwner.github.io" }

    Write-Log -Severity INFO -Step "Config" -Message ("Owner={0} Repo={1} Domain={2}" -f $GitHubOwner, $RepoName, $CustomDomain)

    $repoUrl = Ensure-Repository -Owner $GitHubOwner -Name $RepoName
    Invoke-SiteBuild
    Invoke-GitPublish -Owner $GitHubOwner -Name $RepoName
    Set-GitHubPages -Owner $GitHubOwner -Name $RepoName -Domain $CustomDomain

    if ($ConfigureCloudflare -or -not $env:CLOUDFLARE_API_TOKEN) {
        Set-CloudflareDns -Owner $GitHubOwner -Domain $CustomDomain
    }
    else {
        Show-CloudflareChecklist -Owner $GitHubOwner -Domain $CustomDomain
    }

    $pagesUrl = "https://$GitHubOwner.github.io/"
    if ($RepoName -ne "$GitHubOwner.github.io") {
        $pagesUrl = "https://$GitHubOwner.github.io/$RepoName/"
    }
    $customUrl = "https://$CustomDomain/"

    Write-Host ""
    Write-Host "========== FINAL STATUS ==========" -ForegroundColor Cyan
    Write-Host "Completed:"
    $script:Completed | ForEach-Object { Write-Host "  - $_" }
    Write-Host "Warnings:"
    if ($script:Warnings.Count -eq 0) { Write-Host "  (none)" } else { $script:Warnings | ForEach-Object { Write-Host "  - $_" } }
    Write-Host "Requires your action:"
    if ($script:ManualActions.Count -eq 0) { Write-Host "  (none detected)" } else { $script:ManualActions | ForEach-Object { Write-Host "  - $_" } }
    Write-Host "URLs:"
    Write-Host "  GitHub repo : $repoUrl"
    Write-Host "  GitHub Pages: $pagesUrl"
    Write-Host "  Custom domain: $customUrl"
    Write-Host "Log: $script:LogFile"
    Write-Host "==================================" -ForegroundColor Cyan

    if ($OpenBrowser -and -not $WhatIfPreference) {
        Start-Process $customUrl
    }

    $script:ExitCode = 0
}
catch {
    Write-Log -Severity ERROR -Step "Fatal" -Message $_.Exception.Message
    $script:ExitCode = 1
}
finally {
    exit $script:ExitCode
}
