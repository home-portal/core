<template>
	<div class="panel">
		<div class="box" v-for="item in items" :key="item.date">
			<div class="title">{{ ddd(item.date) }}</div>
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

	methods: {
		ddd(val) {
			return moment(val).format("ddd");
		}
	}
};
</script>

<style lang="scss" scoped>
$islandOrange: rgb(255, 49, 0);

.panel {
	background-color: rgba(black, 0.5);
	border-radius: var(--panelRadius);
	overflow: hidden;

	display: flex;
	justify-content: space-between;

	.box {
		flex: 1;
		border-right: 2px solid rgba(Black, 0.3);
		display: flex;
		flex-direction: column;
		overflow: hidden;

		&:last-child {
			border-right: none;
		}

		.title {
			background-color: rgba(Black, 0.2);
			font-size: 1.2em;
			font-weight: 600;
			text-align: center;
			text-transform: uppercase;
			color: lighten($islandOrange, 15%);
			text-shadow: 1px 1px 4px rgba(Black, 0.6);
		} // .title

		.weather-image {
			display: block;
			flex: 1;
			min-height: 2em;
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
			font-size: 1.2em;
			font-weight: 300;
			text-align: center;
			padding: 0.2em 0;

			.value {
				font-weight: 600;
			}

			.separator {
				opacity: 0.4;
			}

			.degree {
				margin-left: -0.2em;
				font-size: 0.5em;
				font-weight: 300;
				vertical-align: top;
				opacity: 0.7;
			}
		} // .temp
	} // .box
}
</style>
