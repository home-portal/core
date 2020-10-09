module.exports = {
	root: true,

	parserOptions: {
		parser: "babel-eslint",
		sourceType: "module"
	},

	env: {
		node: true,
		browser: true
	},

	globals: {
		HomePortal: true
	},

	extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],

	rules: {
		indent: ["warn", "tab", { SwitchCase: 1 }],
		quotes: ["warn", "double"],
		semi: ["error", "always"],
		"no-var": ["error"],
		"no-console": ["off"],
		"no-unused-vars": ["warn"],
		"no-mixed-spaces-and-tabs": ["warn"],
		"prefer-promise-reject-errors": "off",

		// allow debugger during development only
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
	}
};
