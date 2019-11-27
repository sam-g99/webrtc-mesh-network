module.exports = {
	root: true,
	env: {
	  node: true,
	},
	extends: [
	  'plugin:vue/essential',
	  '@vue/airbnb',
	  'plugin:vue/recommended',
	  'eslint:recommended',
	  'prettier/vue',
	  'plugin:prettier/recommended',
	],
	plugins: ['prettier'],
	rules: {
	  'linebreak-style': 0,
	  'global-require': 0,
	  'import/no-unresolved': 0,
	  'import/extensions': 0,
	  "vue/attribute-hyphenation":0,
	  'eslint linebreak-style': [0, 'error', 'windows'],
	  'vue/component-name-in-template-casing': ['error', 'PascalCase'],
	  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	  'prettier/prettier': [
		'error',
		{
		  singleQuote: true,
		  trailingComma: 'all',
		},
	  ],
	},
	parserOptions: {
	  parser: 'babel-eslint',
	},
	overrides: [
	  {
		files: ['**/__tests__/*.{j,t}s?(x)'],
		env: {
		  mocha: true,
		},
	  },
	],
  };
  