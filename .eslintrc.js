module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@babel/eslint-parser',
  parserOptions: {
    // true = bắt buộc dùng babel.config.js
    // nếu để false thì phải config qua parserOptions.babelOptions
    requireConfigFile: true,
    // babelOptions: {
    //   presets: ['module:@react-native/babel-preset'],
    //   // KHÔNG khai báo các plugin nặng như worklets/reanimated ở đây
    // },
  },
  rules: {
    // Tắt hẳn rule inline styles
    'react-native/no-inline-styles': 'off',

    // Tắt hẳn
    // '@typescript-eslint/no-unused-vars': 'off',
    // Hoặc nếu muốn chỉ warning (gạch vàng chứ không đỏ):
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
};
