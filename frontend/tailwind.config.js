module.exports = {
	future: {
		// removeDeprecatedGapUtilities: true,
		// purgeLayersByDefault: true,
	},
	//purge: [],
	purge: false,
	theme: {
		fontFamily: {
			sans: ["Roboto", "Arial", "sans-serif"]
		},
		extend: {
			colors: {
				primary: "#00e9e9"
				//"primary-dark": "#2c839b",
				//"primary-light": "#68c1d9",
				//"primary-lighter": "#99d5e6",
				//"primary-lightest": "#c6e7f1"
			}
		}
	},
	variants: {},
	plugins: []
};
