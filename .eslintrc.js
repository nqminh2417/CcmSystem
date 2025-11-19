module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // Tắt hẳn rule inline styles
    'react-native/no-inline-styles': 'off',

    // Tắt hẳn
    // '@typescript-eslint/no-unused-vars': 'off',
    // Hoặc nếu muốn chỉ warning (gạch vàng chứ không đỏ):
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
};
