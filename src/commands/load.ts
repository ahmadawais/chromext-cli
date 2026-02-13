import { execSync } from 'node:child_process';
import pc from 'picocolors';
import ora from 'ora';
import { validateExtensionPath } from '../utils/chrome.js';

export async function loadCommand(extPath: string) {
	let absPath: string;
	try {
		absPath = validateExtensionPath(extPath);
	} catch (err) {
		console.error(pc.red(err instanceof Error ? err.message : String(err)));
		process.exit(1);
	}

	// Copy path to clipboard for easy pasting
	try {
		execSync(`printf '%s' "${absPath}" | pbcopy`, { stdio: 'ignore' });
	} catch {}

	const spinner = ora('Opening Chrome extensions page…').start();

	const script = `
tell application "Google Chrome"
	activate
	open location "chrome://extensions"
end tell
`;

	try {
		execSync(`osascript -e '${script}'`, { stdio: 'ignore', timeout: 10_000 });
		spinner.succeed('Opened chrome://extensions');
	} catch {
		spinner.fail('Failed to open Chrome');
		process.exit(1);
	}

	console.log();
	console.log(`  ${pc.bold('Path copied to clipboard:')} ${pc.cyan(absPath)}`);
	console.log();
	console.log(pc.dim('  1. Enable "Developer mode" (top-right toggle)'));
	console.log(pc.dim('  2. Click "Load unpacked"'));
	console.log(pc.dim('  3. Press Cmd+Shift+G → Cmd+V → Enter'));
	console.log();
}
