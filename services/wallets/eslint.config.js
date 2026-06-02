import base from '../../eslint.config.base.js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...base,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
