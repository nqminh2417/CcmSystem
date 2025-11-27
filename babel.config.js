module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel',],
    plugins: [
      'react-native-paper/babel',
      'react-native-reanimated/plugin',
    ],
  };
};