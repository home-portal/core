module.exports = {
	root: false,

	parserOptions: {
		parser: "babel-eslint",
		sourceType: "module"
	},

	env: {
		browser: true
	},

	extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],

	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
	}
};
