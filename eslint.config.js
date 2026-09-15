'use strict';

const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
	{
		ignores: ['out/**', '.vscode-test/**', 'eslint.config.js'],
	},
	{
		...js.configs.recommended,
		files: ['**/*.ts'],
	},
	...tseslint.configs['flat/recommended'],
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
		},
		rules: {
			'semi': [2, 'always'],
			'@typescript-eslint/no-unused-vars': 0,
			'@typescript-eslint/no-explicit-any': 0,
			'@typescript-eslint/explicit-module-boundary-types': 0,
			'@typescript-eslint/no-non-null-assertion': 0,
		},
	},
];
