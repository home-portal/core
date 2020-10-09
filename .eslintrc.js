module.exports = {
	root: true,
	env: {
		node: true,
		commonjs: true,
		es6: true,
		jquery: false,
		jest: true,
		jasmine: true
	},
	extends: ["eslint:recommended", "plugin:prettier/recommended"],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2018
	},
	plugins: ["node"],
	rules: {
		indent: ["warn", "tab", { SwitchCase: 1 }],
		quotes: ["warn", "double"],
		semi: ["error", "always"],
		"no-var": ["error"],
		"no-console": ["warn"],
		"no-unused-vars": ["warn"],
		"no-trailing-spaces": ["error"],
		"object-curly-spacing": ["warn", "always"]
	}
};
