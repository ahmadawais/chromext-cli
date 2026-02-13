import { execSync } from 'node:child_process';
import path from 'node:path';
import pc from 'picocolors';
import ora from 'ora';
import { getChromePath, validateExtensionPath } from '../utils/chrome.js';

export async function packCommand(extPath: string) {
	let absPath: string;
	try {
		absPath = validateExtensionPath(extPath);
	} catch (err) {
		console.error(pc.red(err instanceof Error ? err.message : String(err)));
		process.exit(1);
	}

	const chromePath = getChromePath();

	const spinner = ora('Packing extension…').start();

	try {
		execSync(`"${chromePath}" --pack-extension="${absPath}"`, {
			stdio: 'ignore',
			timeout: 30_000
		});

		const parentDir = path.dirname(absPath);
		const extName = path.basename(absPath);
		const crxPath = path.join(parentDir, `${extName}.crx`);
		const pemPath = path.join(parentDir, `${extName}.pem`);

		spinner.succeed('Extension packed successfully');
		console.log();
		console.log(`  ${pc.bold('CRX:')} ${pc.cyan(crxPath)}`);
		console.log(`  ${pc.bold('PEM:')} ${pc.cyan(pemPath)}`);
		console.log();
	} catch (err) {
		spinner.fail('Failed to pack extension');
		console.error(
			pc.red(
				err instanceof Error ? err.message : 'Unknown error occurred'
			)
		);
		process.exit(1);
	}
}
