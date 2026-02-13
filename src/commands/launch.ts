import { execSync } from 'node:child_process';
import pc from 'picocolors';
import ora from 'ora';
import {
	isChromeRunning,
	validateExtensionPath
} from '../utils/chrome.js';

export async function launchCommand(extPath: string) {
	let absPath: string;
	try {
		absPath = validateExtensionPath(extPath);
	} catch (err) {
		console.error(pc.red(err instanceof Error ? err.message : String(err)));
		process.exit(1);
	}

	if (isChromeRunning()) {
		console.log(
			pc.yellow(
				'⚠ Chrome is already running. The --load-extension flag only works on a fresh launch.'
			)
		);
		console.log(
			pc.dim('  Quit Chrome first, then re-run this command.\n')
		);
	}

	const spinner = ora('Launching Chrome with extension…').start();

	try {
		execSync(
			`open -a "Google Chrome" --args --load-extension="${absPath}"`,
			{ stdio: 'ignore' }
		);
		spinner.succeed('Chrome launched with extension loaded');
		console.log(`  ${pc.dim('Extension:')} ${pc.cyan(absPath)}\n`);
	} catch {
		spinner.fail('Failed to launch Chrome');
		process.exit(1);
	}
}
