const path = require("path");
const Runner = require("moleculer").Runner;

const runner = new Runner();

runner
	.start([
		process.argv[0],
		__filename,
		"--config",
		path.join(__dirname, "moleculer.config.js"),
		"--repl",
		path.join(__dirname, "backend", "services")
	])
	.then(broker => {})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
