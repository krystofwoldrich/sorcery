import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import atob from './atob.js';
import SOURCEMAPPING_URL from './sourceMappingURL.js';

function parseJSON(json, url) {
	try {
		return JSON.parse(json);
	} catch (err) {
		throw new Error(`Could not parse sourcemap (${url}): ${err.message}`);
	}
}

/**
 * Turns a sourceMappingURL into a sourcemap
 * @param {string} url - the sourceMappingURL. Can be a
   base64-encoded data URI
 * @param {string} base - the URL against which relative URLS
   should be resolved
 * @param {boolean} sync - if `true`, return a promise, otherwise
   return the sourcemap
 * @returns {object} - a version 3 sourcemap
 */
export default function getMapFromUrl(url, base, sync) {
	if (/^data:/.test(url)) {
		// TODO beef this up
		const match = /base64,(.+)$/.exec(url);

		if (!match) {
			throw new Error(`${SOURCEMAPPING_URL} is not base64-encoded`);
		}

		const json = atob(match[1]);
		const map = parseJSON(json, `data URI in ${base}`);
		return sync ? map : Promise.resolve(map);
	}

	url = resolve(dirname(base), decodeURI(url));

	if (sync) {
		return parseJSON(readFileSync(url, { encoding: 'utf-8' }), url);
	} else {
		const json = readFileSync(url, 'utf-8');
		return Promise.resolve(parseJSON(json, url));
	}
}
