/**
 * Lightweight validation for the architecture portfolio site.
 * Runs without a browser. Exit code 1 on failure.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

// Required routes (source pages)
const requiredPages = [
  "src/pages/index.astro",
  "src/pages/work/index.astro",
  "src/pages/work/[slug].astro",
  "src/pages/resume.astro",
  "src/pages/about.astro",
  "src/pages/contact.astro",
  "src/pages/404.astro",
];

for (const p of requiredPages) {
  if (!existsSync(join(root, p))) fail(`Missing required page: ${p}`);
}

// Required public assets / metadata
const requiredPublic = [
  "public/CNAME",
  "public/robots.txt",
  "public/favicon.svg",
  "public/og-image.svg",
  "public/sitemap.xml",
];
for (const p of requiredPublic) {
  if (!existsSync(join(root, p))) fail(`Missing public asset: ${p}`);
}

// CNAME
const cname = readFileSync(join(root, "public/CNAME"), "utf8").trim();
if (cname !== "michaelandrewhood.com") {
  fail(`CNAME must be michaelandrewhood.com (found: ${cname})`);
}

// Centralized data files
const dataFiles = [
  "src/data/profile.ts",
  "src/data/metrics.ts",
  "src/data/experience.ts",
  "src/data/capabilities.ts",
  "src/data/case-studies.ts",
  "src/data/navigation.ts",
];
for (const p of dataFiles) {
  if (!existsSync(join(root, p))) fail(`Missing data file: ${p}`);
}

// Profile metadata checks
const profileSrc = readFileSync(join(root, "src/data/profile.ts"), "utf8");
for (const needle of [
  "michaelandrewhood.com",
  "michael.andrew.hood@gmail.com",
  "linkedin.com/in/michael-andrew-hood",
  "showPhone",
  "showCurrentEmployerName",
]) {
  if (!profileSrc.includes(needle)) fail(`profile.ts missing expected config: ${needle}`);
}

// Secrets / private interview must not be tracked content in repo tree for publish
if (existsSync(join(root, "private-interview"))) {
  warn("private-interview/ exists locally (expected). Ensure it remains gitignored.");
}

const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
if (!gitignore.includes("private-interview")) {
  fail(".gitignore must exclude private-interview/");
}

// Scan tracked-ish source for obvious secret patterns
const scanRoots = ["src", "scripts", "public", ".github"];
const secretPatterns = [
  /CLOUDFLARE_API_TOKEN\s*=\s*['"][^'"]+['"]/,
  /ghp_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /-----BEGIN (RSA |OPENSSH )?PRIVATE KEY-----/,
];
for (const scanRoot of scanRoots) {
  const dir = join(root, scanRoot);
  for (const file of walk(dir)) {
    if (file.endsWith(".png") || file.endsWith(".jpg")) continue;
    let text = "";
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const re of secretPatterns) {
      if (re.test(text)) fail(`Possible secret in ${relative(root, file)}`);
    }
  }
}

// Case study routes expected in data
const caseStudySrc = readFileSync(join(root, "src/data/case-studies.ts"), "utf8");
const expectedSlugs = [
  "healthcare-enterprise-architecture",
  "client-integration-reference-architecture",
  "ai-ready-context-ingestion",
  "code-derived-architecture",
  "commerce-platform-modernization",
  "retail-deployment-transformation",
];
for (const slug of expectedSlugs) {
  if (!caseStudySrc.includes(`slug: "${slug}"`)) fail(`Missing case study slug: ${slug}`);
}

// Deploy workflow
if (!existsSync(join(root, ".github/workflows/deploy.yml"))) {
  fail("Missing GitHub Actions deploy workflow");
}

// Summary
if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((w) => console.log(`  WARN  ${w}`));
}
if (errors.length) {
  console.error("Validation failed:");
  errors.forEach((e) => console.error(`  ERROR ${e}`));
  process.exit(1);
}

console.log("Validation passed.");
console.log(
  `  Checked ${requiredPages.length} pages, ${requiredPublic.length} public assets, data + secrets heuristics.`,
);
