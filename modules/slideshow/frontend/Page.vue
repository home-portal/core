<template>
	<div class="page" @click="goHome">
		<div class="images">
			<div class="img1" ref="img1"></div>
			<div class="img2" ref="img2"></div>
			<div class="cache" ref="cache"></div>
		</div>

		<div v-if="settings.clock && (settings.clock.showTime || settings.clock.showDate)"
			:class="'clock ' + settings.clock.position">
			<div v-if="settings.clock.showTime" class="time">{{ time }}</div>
			<div v-if="settings.clock.showDate" class="date">{{ date }}</div>
		</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module, too.
const moment = HomePortal.dependencies.moment;

export default {
	data() {
		return {
			timer: null,
			index: 0,
			settings: {},
			images: [],
			time: null,
			date: null,
		};
	},

	methods: {
		goHome() {
			HomePortal.goHome();
		},

		async getImageList() {
			const images = await this.broker.call("slideshow.getImages");
			this.images = this.shuffle(images);
			//console.log("Images", this.images);
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
		},

		updateTimeInfo() {
			this.time = moment().format(this.settings.clock?.timeFormat || "LT")
			this.date = moment().format(this.settings.clock?.dateFormat || "LL")
		}
	},

	async created() {
		this.settings = HomePortal.getModuleSettings("slideshow");
		console.log("Module settings", this.settings);

		this.timeTimer = setInterval(() => {
			this.updateTimeInfo()
		});
		this.updateTimeInfo();

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

		> div {
			opacity: 0;
			position: absolute;
			width: 100%;
			height: 100%;
			background-size: cover;
			background-position: center center;

			transition: opacity 3s ease-in-out;

			&.active {
				opacity: 1;
			}
		} // div

	} // .images

	.clock {
		position: absolute;

		&.topLeft {	top: 0;	left: 0; }
		&.topCenter {	top: 0;	left: 0; right: 0; }
		&.topRight {	top: 0;	right: 0; }

		&.bottomLeft {	bottom: 0;	left: 0; }
		&.bottomCenter {	bottom: 0;	left: 0; right: 0; }
		&.bottomRight {	bottom: 0;	right: 0; }

		margin: 1em;

		font-weight: 400;

		border-radius: 0 var(--panelRadius) var(--panelRadius) 0;
		text-shadow: 2px 2px 12px rgba(black, 1.0);
		color: rgba(White, 0.9);

		.time {
			display: block;
			font-size: 4.5em;
			line-height: 1.0em;
			text-align: center;
		} // .time

		.date {
			font-size: 1.3em;
			margin-top: 0.5em;
			line-height: 1.0em;
			text-align: center;
		} // .date

	} // .panel-time
</style>
