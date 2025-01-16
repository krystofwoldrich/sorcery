import getMapFromUrl from './getMapFromUrl.js';
import getSourceMappingUrl from './getSourceMappingUrl.js';

export default function getMap(node, sourceMapByPath, sync) {
	if (node.file in sourceMapByPath) {
		const map = sourceMapByPath[node.file];
		return sync ? map : Promise.resolve(map);
	} else {
		const url = getSourceMappingUrl(node.content);

		if (!url) {
			node.isOriginalSource = true;
			return sync ? null : Promise.resolve(null);
		}

		try {
			return getMapFromUrl(url, node.file, sync);
		} catch (error) {
			console.error(`Error getting source map for ${node.file}: ${error.message}`);
			// not correct, but if the source maps don't ship with the library we can treat the file as original source
			node.isOriginalSource = true;
			return sync ? null : Promise.resolve(null);
		}
	}
}
