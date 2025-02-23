// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = async () => {
  const { withSorcery } = await import('@krystofs/sorcery');

  return withSorcery(
  getDefaultConfig(__dirname),
);
}

module.exports = config;
