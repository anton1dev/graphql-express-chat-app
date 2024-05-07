import globals from 'globals'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'

export default [
  { languageOptions: { globals: globals.browser } },
  pluginReactConfig,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': ['error', { ignore: ['jsx', 'js'] }],
    },
  },
]
