#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
import { createRequire } from "module";

// src/utils/banner.ts
import pc from "picocolors";
var banner = `
${pc.white("  \u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557  \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557  \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557   \u2588\u2588\u2557")}
${pc.white(" \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u255A\u2588\u2588\u2557\u2588\u2588\u2554\u255D\u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D\u255A\u2588\u2588\u2557 \u2588\u2588\u2554\u255D")}
${pc.gray(" \u2588\u2588\u2551     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2554\u2588\u2588\u2588\u2588\u2554\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557   \u255A\u2588\u2588\u2588\u2554\u255D    \u2588\u2588\u2551    \u255A\u2588\u2588\u2588\u2588\u2554\u255D")}
${pc.gray(" \u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\u255A\u2588\u2588\u2554\u255D\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D   \u2588\u2588\u2554\u2588\u2588\u2557    \u2588\u2588\u2551     \u255A\u2588\u2588\u2554\u255D")}
${pc.dim(" \u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551 \u255A\u2550\u255D \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2554\u255D \u2588\u2588\u2557   \u2588\u2588\u2551      \u2588\u2588\u2551")}
${pc.dim("  \u255A\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D     \u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D   \u255A\u2550\u255D      \u255A\u2550\u255D")}
`;
function showBanner() {
  console.log(banner);
}

// src/commands/load.ts
import { execSync as execSync2 } from "child_process";
import pc2 from "picocolors";
import ora from "ora";

// src/utils/chrome.ts
import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";
var DEFAULT_CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
function getChromePath() {
  if (existsSync(DEFAULT_CHROME_PATH)) {
    return DEFAULT_CHROME_PATH;
  }
  try {
    const found = execSync(
      'mdfind "kMDItemCFBundleIdentifier == com.google.Chrome"',
      { encoding: "utf-8" }
    ).trim();
    if (found) {
      const chromeBin = path.join(
        found.split("\n")[0],
        "Contents/MacOS/Google Chrome"
      );
      if (existsSync(chromeBin)) return chromeBin;
    }
  } catch {
  }
  throw new Error(
    "Google Chrome not found. Install it or set the path manually."
  );
}
function isChromeRunning() {
  try {
    execSync('pgrep -x "Google Chrome"', { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
function validateExtensionPath(extPath) {
  const abs = path.resolve(extPath);
  const manifest = path.join(abs, "manifest.json");
  if (!existsSync(manifest)) {
    throw new Error(
      `No manifest.json found in ${abs}. Is this a Chrome extension?`
    );
  }
  return abs;
}

// src/commands/load.ts
async function loadCommand(extPath) {
  let absPath;
  try {
    absPath = validateExtensionPath(extPath);
  } catch (err) {
    console.error(pc2.red(err instanceof Error ? err.message : String(err)));
    process.exit(1);
  }
  try {
    execSync2(`printf '%s' "${absPath}" | pbcopy`, { stdio: "ignore" });
  } catch {
  }
  const spinner = ora("Opening Chrome extensions page\u2026").start();
  const script = `
tell application "Google Chrome"
	activate
	open location "chrome://extensions"
end tell
`;
  try {
    execSync2(`osascript -e '${script}'`, { stdio: "ignore", timeout: 1e4 });
    spinner.succeed("Opened chrome://extensions");
  } catch {
    spinner.fail("Failed to open Chrome");
    process.exit(1);
  }
  console.log();
  console.log(`  ${pc2.bold("Path copied to clipboard:")} ${pc2.cyan(absPath)}`);
  console.log();
  console.log(pc2.dim('  1. Enable "Developer mode" (top-right toggle)'));
  console.log(pc2.dim('  2. Click "Load unpacked"'));
  console.log(pc2.dim("  3. Press Cmd+Shift+G \u2192 Cmd+V \u2192 Enter"));
  console.log();
}

// src/commands/pack.ts
import { execSync as execSync3 } from "child_process";
import path2 from "path";
import pc3 from "picocolors";
import ora2 from "ora";
async function packCommand(extPath) {
  let absPath;
  try {
    absPath = validateExtensionPath(extPath);
  } catch (err) {
    console.error(pc3.red(err instanceof Error ? err.message : String(err)));
    process.exit(1);
  }
  const chromePath = getChromePath();
  const spinner = ora2("Packing extension\u2026").start();
  try {
    execSync3(`"${chromePath}" --pack-extension="${absPath}"`, {
      stdio: "ignore",
      timeout: 3e4
    });
    const parentDir = path2.dirname(absPath);
    const extName = path2.basename(absPath);
    const crxPath = path2.join(parentDir, `${extName}.crx`);
    const pemPath = path2.join(parentDir, `${extName}.pem`);
    spinner.succeed("Extension packed successfully");
    console.log();
    console.log(`  ${pc3.bold("CRX:")} ${pc3.cyan(crxPath)}`);
    console.log(`  ${pc3.bold("PEM:")} ${pc3.cyan(pemPath)}`);
    console.log();
  } catch (err) {
    spinner.fail("Failed to pack extension");
    console.error(
      pc3.red(
        err instanceof Error ? err.message : "Unknown error occurred"
      )
    );
    process.exit(1);
  }
}

// src/commands/launch.ts
import { execSync as execSync4 } from "child_process";
import pc4 from "picocolors";
import ora3 from "ora";
async function launchCommand(extPath) {
  let absPath;
  try {
    absPath = validateExtensionPath(extPath);
  } catch (err) {
    console.error(pc4.red(err instanceof Error ? err.message : String(err)));
    process.exit(1);
  }
  if (isChromeRunning()) {
    console.log(
      pc4.yellow(
        "\u26A0 Chrome is already running. The --load-extension flag only works on a fresh launch."
      )
    );
    console.log(
      pc4.dim("  Quit Chrome first, then re-run this command.\n")
    );
  }
  const spinner = ora3("Launching Chrome with extension\u2026").start();
  try {
    execSync4(
      `open -a "Google Chrome" --args --load-extension="${absPath}"`,
      { stdio: "ignore" }
    );
    spinner.succeed("Chrome launched with extension loaded");
    console.log(`  ${pc4.dim("Extension:")} ${pc4.cyan(absPath)}
`);
  } catch {
    spinner.fail("Failed to launch Chrome");
    process.exit(1);
  }
}

// src/index.ts
var require2 = createRequire(import.meta.url);
var { version } = require2("../package.json");
var program = new Command();
program.name("chromexty").description("CLI for managing Chrome extensions").version(version, "-v, --version").hook("preAction", () => {
  showBanner();
});
program.command("load").description("Load an unpacked extension into Chrome").argument("[path]", "Path to the extension directory", ".").action(async (extPath) => {
  await loadCommand(extPath);
});
program.command("pack").description("Pack an extension into a .crx file").argument("[path]", "Path to the extension directory", ".").action(async (extPath) => {
  await packCommand(extPath);
});
program.command("launch").description("Launch Chrome with an extension loaded").argument("[path]", "Path to the extension directory", ".").action(async (extPath) => {
  await launchCommand(extPath);
});
program.parse();
