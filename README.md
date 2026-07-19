# Michael Andrew Hood — Architecture Portfolio

Static architecture portfolio, résumé, and recruiter landing site for **Michael Andrew Hood**.

- **Domain:** [michaelandrewhood.com](https://michaelandrewhood.com)
- **Stack:** Astro, TypeScript, semantic HTML, custom CSS, GSAP ScrollTrigger, Lenis
- **Hosting:** GitHub Pages + custom domain (Cloudflare DNS)
- **Privacy:** No tracking, no backend, no contact form processor

## Local setup (Windows / PowerShell)

Requirements:

- PowerShell 7+
- Node.js 22 LTS or newer
- npm
- Git
- GitHub CLI (`gh`) for deployment automation

```powershell
# From the project root
npm ci
npm run dev
```

Open the URL printed by Astro (typically `http://localhost:4321`).

## Commands

| Command                | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Local development server                      |
| `npm run build`        | Production build to `dist/`                   |
| `npm run preview`      | Preview the production build                  |
| `npm run check`        | Astro + TypeScript checks                     |
| `npm run format`       | Format with Prettier                          |
| `npm run format:check` | CI format check                               |
| `npm run validate`     | Route, metadata, CNAME, secret heuristics     |
| `npm run smoke`        | HTTP smoke test against preview (after build) |

## Content editing guide

All public copy is centralized:

| File                       | Contents                                                                        |
| -------------------------- | ------------------------------------------------------------------------------- |
| `src/data/profile.ts`      | Name, headline, domain, email, LinkedIn, employer disclosure, phone toggle, SEO |
| `src/data/metrics.ts`      | Outcome metrics (single source of truth)                                        |
| `src/data/experience.ts`   | Timeline + résumé experience                                                    |
| `src/data/capabilities.ts` | Capability groups + architecture principles                                     |
| `src/data/case-studies.ts` | Case study narratives                                                           |
| `src/data/navigation.ts`   | Nav links                                                                       |

### Privacy toggles (`profile.ts`)

- `showCurrentEmployerName` / `currentEmployerName` — disclose employer without multi-page edits
- `showPhone` / `phone` — phone stays off the public site by default
- `showExactMetrics` — metric presentation control
- `showAvailability` — do not claim open job search unless enabled

Metrics marked `// USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION` should be confirmed before sharing widely.

## Deployment

GitHub Actions workflow: `.github/workflows/deploy.yml`

1. Pushes to `main` install dependencies, validate, build, and deploy to GitHub Pages.
2. `public/CNAME` sets the custom domain to `michaelandrewhood.com`.
3. Configure the repository Pages settings to **GitHub Actions** as the source.

### Bootstrap automation

```powershell
.\Bootstrap-ArchitecturePortfolio.ps1 -WhatIf
.\Bootstrap-ArchitecturePortfolio.ps1 -OpenBrowser
```

The script validates dependencies, GitHub auth, repository setup, build, push, Pages configuration, and optional Cloudflare DNS (if `CLOUDFLARE_API_TOKEN` is set and `-ConfigureCloudflare` is passed).

## Custom domain (Cloudflare)

Domain is registered at Cloudflare. Preferred records (DNS-only until certificates issue):

| Type  | Name                         | Target                    |
| ----- | ---------------------------- | ------------------------- |
| CNAME | `@` (apex, CNAME flattening) | `<github-user>.github.io` |
| CNAME | `www`                        | `<github-user>.github.io` |

Then enable HTTPS / enforce HTTPS in GitHub Pages after the certificate provisions.

If no API token is available, the bootstrap script prints a manual checklist.

## Accessibility

- Semantic landmarks and heading hierarchy
- Skip-to-content link
- Visible `:focus-visible` styles
- WCAG AA contrast targets on the dark theme
- `prefers-reduced-motion` disables Lenis smooth scroll, pinning, and nonessential animation
- Content remains readable without JavaScript
- Print-friendly résumé at `/resume/`

## Privacy notes

- No third-party analytics by default
- No cookie banner (nothing to consent to)
- Email is standard `mailto:` (optionally attributes split for light obfuscation)
- `private-interview/` is local-only and gitignored

## Project layout

```
src/data/           # centralized content
src/components/     # UI + diagrams
src/layouts/        # Base + case study layouts
src/pages/          # routes
src/scripts/        # scrolling + navigation (client)
src/styles/         # global + print CSS
public/             # CNAME, favicon, OG image, robots, sitemap
scripts/            # validate + smoke tests
.github/workflows/  # Pages deploy
private-interview/  # local only (gitignored)
```

## License

No open-source license is attached by default. All rights reserved unless you explicitly add a license.
