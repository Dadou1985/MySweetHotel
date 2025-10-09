const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimize file watching to prevent EMFILE errors
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Reduce the number of files being watched
config.resolver.blacklistRE = /node_modules\/.*\/node_modules\/react-native\/.*/;

// Optimize file watching
config.watcher = {
  additionalExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  watchman: {
    deferStates: ['hg.update']
  }
};

// Reduce memory usage
config.serializer = {
  ...config.serializer,
  customSerializer: config.serializer.customSerializer,
};

module.exports = config;

