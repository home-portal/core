<template>
	<div class="page" @click="goHome">
		<div :class="'images ' + settings.imageSize">
			<div class="img1" ref="img1"></div>
			<div class="img2" ref="img2"></div>
			<div class="cache" ref="cache"></div>
		</div>
		<div :class="'overlay level-' + (settings.overlayLevel || 0)"></div>
		<clock v-if="settings.clock && (settings.clock.showTime || settings.clock.showDate)" :settings="settings.clock"></clock>
		<weather-now v-if="settings.weatherNow" :settings="settings.weatherNow"></weather-now>
		<weather-forecast v-if="settings.weatherForecast" :settings="settings.weatherForecast"></weather-forecast>
	</div>
</template>

<script>
import Clock from "./components/Clock";
import WeatherNow from "./components/WeatherNow";
import WeatherForecast from "./components/WeatherForecast";

export default {
	components: {
		Clock,
		WeatherNow,
		WeatherForecast
	},

	data() {
		return {
			timer: null,
			index: 0,
			settings: {},
			images: [],
		};
	},

	methods: {
		goHome() {
			HomePortal.goHome();
		},

		async getImageList() {
			const images = await this.broker.call("slideshow.getImages");
			this.images = this.settings.scanning?.shuffle ? this.shuffle(images) : images;
		},

		shuffle(array) {
			let counter = array.length;
			while(counter > 0) {
				// Pick a random index
				const index = Math.floor(Math.random() * counter)
				// Decrease counter by 1
				counter--
				// And swap the last element with it
				const temp = array[counter]
				array[counter] = array[index]
				array[index] = temp
			}

			return array
		},

		showFirstImage() {
			this.index = -1;
			this.showNext();
		},

		getNextImage(noInc) {
			const old = this.index++;
			if (this.index >= this.images.length) {
				this.index = 0;
				this.getImageList(); // Refresh the list
			}
			const res = this.images[this.index];
			if (noInc) this.index = old;

			return res
		},

		showNext() {
			let imgCurrent, imgNext;

			if (this.$refs.img1.classList.contains("active")) {
				imgCurrent = this.$refs.img1
				imgNext = this.$refs.img2
			} else {
				imgCurrent = this.$refs.img2
				imgNext = this.$refs.img1
			}

			const nextImageURL = this.getNextImage();
			imgNext.style.backgroundImage = `url('${nextImageURL}')`;

			// Lecache-ljük a következő képet, hogy mire átváltunk már ott legyen
			const next2ImageURL = this.getNextImage(true);
			this.$refs.cache.style.backgroundImage = `url('${next2ImageURL}')`;

			imgCurrent.classList.remove("active");
			imgNext.classList.add("active");
		}
	},

	async created() {
		this.settings = HomePortal.getModuleSettings("slideshow");
		console.log("Module settings", this.settings);

		await this.getImageList();
		this.showFirstImage();
	},

	events: {
		"page-slideshow.activated"() {
			const delay = this.settings.delay ? Number(this.settings.delay) : 10;
			this.timer = setInterval(() => this.showNext(), delay * 1000);
		},

		"page-slideshow.deactivated"() {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
};
</script>

<style lang="scss">
.images {
	position: absolute;
	width: 100%;
	height: 100%;

	background-color: black;

	> div {
		opacity: 0;
		position: absolute;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center center;
		background-repeat: no-repeat;

		transition: opacity 3s ease-in-out;

		&.active {
			opacity: 1;
		}
	} // div

	&.contain > div {
		background-size: contain;
	}

	.cache {
		visibility: hidden;
	}

} // .images

.overlay {
	position: absolute;
	width: 100%;
	height: 100%;

	&.level-1 {	background: rgba(black, 0.1); }
	&.level-2 {	background: rgba(black, 0.2); }
	&.level-3 {	background: rgba(black, 0.3); }
	&.level-4 {	background: rgba(black, 0.4); }
	&.level-5 {	background: rgba(black, 0.5); }
	&.level-6 {	background: rgba(black, 0.6); }
	&.level-7 {	background: rgba(black, 0.7); }
	&.level-8 {	background: rgba(black, 0.8); }
	&.level-9 {	background: rgba(black, 0.9); }
}

.position {
	position: absolute;

	&.topLeft {	top: 0;	left: 0; }
	&.topCenter {	top: 0;	left: 0; right: 0; }
	&.topRight {	top: 0;	right: 0; }

	&.bottomLeft {	bottom: 0;	left: 0; }
	&.bottomCenter {	bottom: 0;	left: 0; right: 0; }
	&.bottomRight {	bottom: 0;	right: 0; }
}
</style>
