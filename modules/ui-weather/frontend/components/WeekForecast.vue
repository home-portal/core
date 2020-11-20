<template>
	<div class="panel">
		<div class="box" v-for="item in items" :key="item.date">
			<div class="title">{{ item.date | ddd }}</div>
			<div :class="'weather-image ' + item.icon"></div>
			<div v-if="item.precipitation" class="precipitation">{{ Math.round(item.precipitation) }} {{precipitationUnit }}</div>
			<div v-if="item.temperature" class="temperature">
				<span class="value max">{{ Math.round(item.temperature.max) }}</span>
				<span :class="'degree ' + data.unit"></span>
				<span class="separator">/</span>
				<span class="value min">{{ Math.round(item.temperature.min) }}</span>
				<span :class="'degree ' + data.unit"></span>
			</div>
		</div>
	</div>
</template>

<script>
const moment = HomePortal.dependencies.moment;

export default {
	props: ["settings", "data"],

	computed: {
		items() {
			return this.data?.forecast?.slice(0,7) || [];
		},

		precipitationUnit() {
			return this.data?.unit == "imperial" ? "in" : "mm";
		}
	},

	filters: {
		ddd(val) {
			return moment(val * 1000).format("ddd");
		}
	}
};
</script>

<style lang="scss" scoped>
$islandOrange: rgb(255, 49, 0);

.panel {
	background-color: rgba(black, 0.5);

	display: flex;
	justify-content: space-between;

	.box {
		flex: 1;
		height: 100%;
		border-right: 2px solid rgba(Black, 0.3);

		.title {
			background-color: rgba(Black, 0.2);
			font-size: 1.5em;
			font-weight: 600;
			text-align: center;
			text-transform: uppercase;
			color: lighten($islandOrange, 15%);
			text-shadow: 1px 1px 4px rgba(Black, 0.6);
		} // .title

		.icon {
			display: block;
			font-size: 2em;
			font-weight: 400;
			text-align: center;
			text-shadow: 1px 1px 5px rgba(Black, 0.9);
			//color: lighten($masterColor, 35%);
		} // .icon

		.weather-image {
			display: block;
			height: 4em;
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;
		}

		.precipitation {
			font-size: 0.6em;
			text-align: right;
			height: 0px;
			position: relative;
			top: -0.5em;
			right: 0.25em;
		}

		.temperature {
			margin-top: 0.6em;
			font-size: 1.5em;
			font-weight: 300;
			text-align: center;

			.value {
				font-weight: 600;
			}

			.separator {
				opacity: 0.4;
			}

			.degree {
				margin-left: -0.5em;
				font-size: 0.5em;

				font-weight: 300;
				vertical-align: top;
				opacity: 0.7;
			}
		} // .temp
	} // .box
}
</style>
