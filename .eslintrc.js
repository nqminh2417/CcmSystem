module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false, // ❗ để nó KHÔNG đọc babel.config.js
    babelOptions: {
      presets: ['module:@react-native/babel-preset'],
      // KHÔNG khai báo plugins: ['nativewind/babel', 'react-native-reanimated/plugin'] ở đây
    },
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
