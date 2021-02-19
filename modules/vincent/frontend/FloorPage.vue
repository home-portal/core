<template>
	<div class="page">
		<div class="overlay"></div>
		<div class="wrapper">
			<div class="page-header">
				<div class="title">
					<span>Sensors</span>
				</div>
				<div class="back-button" @click="broker.call('$router.goHome')"></div>
			</div>
			<div class="page-content">
				<div class="background"></div>
				<div class="devices">
					<div class="device temp" style="top: 130px;left: 200px;">
						<i class="icon fas fa-thermometer-half"></i>
					</div>
					<div class="device lamp" style="top: 130px;left: 300px;">
						<i class="icon fas fa-lightbulb"></i>
					</div>
					<div class="device plug" style="top: 130px;left: 400px;">
						<i class="icon fas fa-plug"></i>
					</div>
					<div class="device water" style="top: 230px;left: 200px;">
						<i class="icon fas fa-faucet"></i>
					</div>
					<div class="device fire" style="top: 230px;left: 300px;">
						<i class="icon fas fa-fire-alt"></i>
					</div>
					<div class="device door" style="top: 230px;left: 400px;">
						<i class="icon fas fa-door-open"></i>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module, too.
const moment = HomePortal.dependencies.moment;
const gsap = HomePortal.dependencies.gsap;

export default {
	data() {
		return {
			settings: {} // mixin
		};
	},

	events: {
		"sensors.data.updated"(ctx) {
			console.log("Sensor data updated", ctx.params);
		}
	},

	methods: {},

	created() {
		this.settings = HomePortal.getModuleSettings("vincent");
		console.log("Module settings", this.settings);
	},

	mounted() {}
};
</script>

<style lang="scss" scoped>
$c: rgb(0, 181, 255); //var(--skyBlue);

.page {
	//background-image: url("./images/background.jpg");
	background-image: radial-gradient(#a6a6a9, #4a4b4c);
}

.overlay {
	//background-color: rgba($c, 0.25);
}

.wrapper {
	height: 100%;
}

.page-content {
	margin: 1em 0;

	.background {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		width: 100%;
		height: 100%;

		background-image: url("./images/Example-Floor.png");
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		filter: drop-shadow(0px 0px 10px black);
	}

	.devices {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		width: 100%;
		height: 100%;
		.device {
			position: absolute;
			width: 3em;
			height: 3em;
			border-radius: 50%;
			background-color: #ff9700;
			color: white;
			box-shadow: 0px 0px 15px rgba(black, 0.7);

			&.lamp {
				background-color: #007eff;
			}

			&.plug {
				background-color: #21a92b;
			}

			&.fire {
				background-color: #ff5200;
			}

			&.water {
				background-color: #00a1ff;
			}

			&.door {
				background-color: #d0469f;
			}

			.icon {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				font-size: 1.5em;
				text-shadow: 1px 1px 1px rgba(black, 0.4);
			}
		}
	}
}
</style>
