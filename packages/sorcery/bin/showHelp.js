import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function (stream) {
	fs.readFile(path.join(__dirname, 'help.md'), function (err, result) {
		var help;

		if (err) throw err;

		help = result.toString().replace('<%= version %>', getVersion());
		(stream || process.stderr).write('\n' + help + '\n');
	});
}

export function getVersion() {
	return JSON.parse(
		fs.readFileSync(new URL('../package.json', import.meta.url))
	).version;
}
