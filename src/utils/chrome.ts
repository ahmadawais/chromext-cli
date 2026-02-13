import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_CHROME_PATH =
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export function getChromePath(): string {
	if (existsSync(DEFAULT_CHROME_PATH)) {
		return DEFAULT_CHROME_PATH;
	}

	try {
		const found = execSync(
			'mdfind "kMDItemCFBundleIdentifier == com.google.Chrome"',
			{ encoding: 'utf-8' }
		).trim();

		if (found) {
			const chromeBin = path.join(
				found.split('\n')[0],
				'Contents/MacOS/Google Chrome'
			);
			if (existsSync(chromeBin)) return chromeBin;
		}
	} catch {}

	throw new Error(
		'Google Chrome not found. Install it or set the path manually.'
	);
}

export function isChromeRunning(): boolean {
	try {
		execSync('pgrep -x "Google Chrome"', { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

export function validateExtensionPath(extPath: string): string {
	const abs = path.resolve(extPath);
	const manifest = path.join(abs, 'manifest.json');

	if (!existsSync(manifest)) {
		throw new Error(
			`No manifest.json found in ${abs}. Is this a Chrome extension?`
		);
	}

	return abs;
}
