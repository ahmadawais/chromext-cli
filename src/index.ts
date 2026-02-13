import { Command } from 'commander';
import { createRequire } from 'node:module';
import { showBanner } from './utils/banner.js';
import { loadCommand } from './commands/load.js';
import { packCommand } from './commands/pack.js';
import { launchCommand } from './commands/launch.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const program = new Command();

program
	.name('chromexty')
	.description('CLI for managing Chrome extensions')
	.version(version, '-v, --version')
	.hook('preAction', () => {
		showBanner();
	});

program
	.command('load')
	.description('Load an unpacked extension into Chrome')
	.argument('[path]', 'Path to the extension directory', '.')
	.action(async (extPath: string) => {
		await loadCommand(extPath);
	});

program
	.command('pack')
	.description('Pack an extension into a .crx file')
	.argument('[path]', 'Path to the extension directory', '.')
	.action(async (extPath: string) => {
		await packCommand(extPath);
	});

program
	.command('launch')
	.description('Launch Chrome with an extension loaded')
	.argument('[path]', 'Path to the extension directory', '.')
	.action(async (extPath: string) => {
		await launchCommand(extPath);
	});

program.parse();
