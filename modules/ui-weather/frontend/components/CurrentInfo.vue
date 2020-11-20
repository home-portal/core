<template>
	<div class="panel flex flex-col select-none" @click="$emit('click', $event)">
		<div v-if="showLocation" class="highlighted top text-center text-lg">{{ location }}</div>
		<div class="flex-1 flex">
			<div v-if="weatherImageName" :class="'flex-1 bg-no-repeat bg-contain bg-center h-20 weather-image ' + weatherImageName"></div>
			<div v-if="temperature" class="temperature">
				<span>{{ temperature }}</span>
				<span :class="'degree ' + data.unit"></span>
			</div>
		</div>

		<div class="text-center font-light text-lg">{{ description }}</div>

		<div class="flex text-xs p-2 justify-around items-end">
			<div v-if="windSpeed" class="info">
				<i class="wi wi-strong-wind"></i>
				<span class="wind-speed">
					<span
						class="wi wi-direction-up"
						:style="'transform: rotate(' + windDeg + 'deg)'"
					></span>
					<span class="value">{{ windSpeed }} {{ speedUnit }}</span>
				</span>
			</div>
			<div v-if="humidity" class="info">
				<i class="wi wi-humidity"></i>
				<span class="humidity">
					<span class="value">{{ humidity }}</span>
					<span>%</span>
				</span>
			</div>
			<div v-if="sunset" class="info">
				<i class="wi wi-sunset"></i>
				<span class="sunset">
					<span class="value">{{ sunset }}</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled again into the module.
const _ = HomePortal.dependencies.lodash;
const moment = HomePortal.dependencies.moment;

export default {
	props: ["showLocation", "settings", "data"],

	computed: {
		location() {
			let s;
			if (this.data && this.data.location) {
				s = this.data.location;

			if (this.data.country)
				s += ", " + this.data.country;
			};

			return s;
		},

		weatherImageName() {
			return this.data?.current?.icon;
		},

		temperature() {
			return this.data?.current?.temperature ? Math.round(this.data.current.temperature) : null;
		},

		description() {
			return this.data?.current?.description;
		},

		windSpeed() {
			return this.data?.current?.wind?.speed ? Number(this.data?.current?.wind?.speed).toFixed(1) : null;
		},

		speedUnit() {
			return this.data?.unit == "imperial" ? "mph" : "km/h"
		},

		windDeg() {
			return this.data?.current?.wind?.degree || 0;
		},

		humidity() {
			return this.data?.current?.humidity;
		},

		sunset() {
			return this.data?.current?.sunset ? moment(this.data.current.sunset).format("LT") : null;
		}
	}
};
</script>

<style lang="scss" scoped>
.panel {
	.temperature {
		flex: initial;
		margin-right: 0.3em;
		padding-top: 0.1em;
		font-size: 4rem;
		line-height: 1em;
		font-weight: 400;
		vertical-align: top;
		text-align: right;

		.degree {
			margin-left: -0.5em;
			font-size: 0.4em;
			vertical-align: super;
		}
	}

	.info {
		text-align: center;

		i {
			margin-right: 4px;
			color: lighten(rgb(255, 49, 0), 15%);
		}

		span {
			font-weight: 400;
		}

		.wi-sprinkles {
			font-size: 1.5em;
			top: 0.1em;
			position: relative;
		}

		.wind-speed {
			.value {
				padding-left: 0.2em;
			}

			.wi-direction-up {
				position: relative;
				top: 0.15em;
				font-size: 1.8em;
				font-weight: 400;
				transform: rotate(0deg);
			}
		}
	}
}
</style>
