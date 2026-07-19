/**
 * Smoke test: preview built site and request key routes.
 * Requires a prior `npm run build`. Does not require a heavyweight browser.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");

if (!existsSync(dist)) {
  console.error("dist/ missing. Run npm run build first.");
  process.exit(1);
}

const port = 4321;
const host = "127.0.0.1";
const base = `http://${host}:${port}`;

const routes = [
  { path: "/", titleIncludes: "Michael Andrew Hood" },
  { path: "/work/", titleIncludes: "Case Studies" },
  { path: "/resume/", titleIncludes: "Résumé" },
  { path: "/about/", titleIncludes: "About" },
  { path: "/contact/", titleIncludes: "Contact" },
  { path: "/work/healthcare-enterprise-architecture/", titleIncludes: "enterprise architecture" },
];

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["astro", "preview", "--host", host, "--port", String(port)],
  { cwd: root, stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32" },
);

let ready = false;
const timeout = setTimeout(() => {
  if (!ready) {
    console.error("Preview server did not become ready in time.");
    child.kill();
    process.exit(1);
  }
}, 30000);

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(base + "/");
      if (res.ok || res.status === 404) {
        ready = true;
        return;
      }
    } catch {
      /* retry */
    }
    await wait(500);
  }
  throw new Error("Server not reachable");
}

async function run() {
  try {
    await waitForServer();
    clearTimeout(timeout);
    const failures = [];
    for (const route of routes) {
      const res = await fetch(base + route.path);
      if (!res.ok) {
        failures.push(`${route.path} → HTTP ${res.status}`);
        continue;
      }
      const html = await res.text();
      if (!html.toLowerCase().includes(route.titleIncludes.toLowerCase())) {
        failures.push(`${route.path} → missing title fragment "${route.titleIncludes}"`);
      } else {
        console.log(`OK  ${route.path}`);
      }
    }
    if (failures.length) {
      console.error("Smoke test failures:");
      failures.forEach((f) => console.error("  " + f));
      process.exitCode = 1;
    } else {
      console.log("Smoke test passed.");
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    clearTimeout(timeout);
    child.kill("SIGTERM");
    // Ensure process exits on Windows
    setTimeout(() => process.exit(process.exitCode ?? 0), 500);
  }
}

child.stdout.on("data", (d) => {
  const s = d.toString();
  if (s.toLowerCase().includes("local") || s.includes(String(port))) {
    /* server chatter */
  }
});
child.stderr.on("data", (d) => {
  process.stderr.write(d);
});

run();
