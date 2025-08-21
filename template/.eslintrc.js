module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'standard-with-typescript',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // 关闭type导入必须指定
    '@typescript-eslint/consistent-type-imports': 'off',
    // 关闭throw时不允许非Error对象
    '@typescript-eslint/no-throw-literal': 'off',
    // 关闭函数大括号前的空格
    '@typescript-eslint/space-before-function-paren': 'off',
    // 关闭对象最后一个元素不允许逗号结尾
    '@typescript-eslint/comma-dangle': 'off',
    // 关闭方法作为变量传递必须绑定范围
    '@typescript-eslint/unbound-method': 'off',
    // 关闭函数必须有返回值
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
