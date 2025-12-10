module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['module:@react-native/babel-preset', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',                // preset của NativeWind v4
    ],
    plugins: [
      'react-native-paper/babel',
      'react-native-worklets/plugin', // plugin CUỐI CÙNG
    ],
  };
};