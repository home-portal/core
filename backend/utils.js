const fs = require("fs").promises;
const { makeDirs } = require("moleculer").Utils;

makeDirs("./tmp");

module.exports = {
	async writeToTemp(name, json) {
		await fs.writeFile(`./tmp/${name}.json`, JSON.stringify(json, null, 2), "utf8");
	}
};
