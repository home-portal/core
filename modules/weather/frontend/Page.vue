<template>
	<div class="page">
		<!-- <div class="overlay"></div> -->
		<div class="wrapper">
			<div class="page-header">
				<div class="title">
					<span v-if="location">Weather in {{ location.city }}</span>
					<span v-else>Weather</span>
				</div>
				<div class="back-button" @click="broker.call('$router.goHome')"></div>
			</div>
			<div class="page-content">
				<video class="radar" v-if="radar && radar.url" autoplay loop :src="radar.url"></video>
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
			settings: {}, // mixin
			lastData: null,
			location: null,
			now: null,
			today: null,
			forecast: null,
			radar: null,
			updatedAt: null
		};
	},

	events: {
		"weather.info.updated"(ctx) {
			this.updateWeatherInfo(ctx.params);
		}
	},

	methods: {
		async updateWeatherInfo(data) {
			if (!data) {
				data = await this.broker.call("weather.get");
			}

			if (data.now) {
				this.location = {
					city: data.now.name,
					country: data.now.sys.country
				};

				this.now = {
					data: data.now,
					weather: data.now.weather[0]
				};
			}

			if (data.today) {
				this.today = {
					list: data.today.list ? data.today.list.slice(0,3) : []
				}
			}

			if (data.forecast) {
				this.forecast = {
					list: data.forecast.list ? data.forecast.list.slice(0,7) : []
				}
			}

			if (this.settings.radarUrl)
				this.radar = { url: this.settings.radarUrl };

			this.updatedAt = data.updatedAt;

			this.lastData = data;

			console.log("Weather updated", this);
		}
	},

	created() {
		this.settings = HomePortal.getModuleSettings("weather");
		console.log("Module settings", this.settings);
	},

	async mounted() {
		await this.updateWeatherInfo();
	}
};
</script>

<style lang="scss" scoped>
$c: rgb(0, 181, 255); //var(--skyBlue);

.page {
	background-image: url("./images/background.jpg");
}

.overlay {
	background-color: rgba($c, 0.25);
}

.page-content {
	margin: 2em;
	display: flex;

	video.radar {
		width: 100%;
		height: 100%;
	}

}
</style>
