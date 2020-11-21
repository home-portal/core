<template>
	<div class="panel">
		<div class="box" v-for="item in items" :key="item.dt">
			<div class="title">{{ item.ts | hhmm }}</div>
			<div :class="'weather-image ' + item.icon"></div>
			<div class="temperature">
				<span class="value">{{ Math.round(item.temperature) }}</span>
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
			return this.data?.today?.slice(0,3) || [];
		}
	},

	filters: {
		hhmm(val) {
			return moment(val * 1000).format("LT");
		}
	}
}
</script>

<style lang="scss" scoped>
$islandOrange: rgb(255, 49, 0);

.panel {
	background-color: rgba(black, 0.5);
	border-radius: var(--panelRadius);

	display: flex;
	justify-content: space-between;

	.box {
		flex: 1;
		height: 100%;
		border-right: 2px solid rgba(Black, 0.3);

		.title {
			background-color: rgba(Black, 0.2);
			font-size: 0.9rem;
			line-height: 1.3rem;
			font-weight: 600;
			text-align: center;
			color: lighten($islandOrange, 15%);
			text-shadow: 1px 1px 3px rgba(Black, 0.6);

		} // .title

		.icon {
			display: block;
			font-size: 2.0rem;
			line-height: 4.0rem;
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

		.temperature {
			font-size: 1.2em;
			line-height: 1.2em;
			font-weight: 300;
			text-align: center;

			.value {
				margin-left: 1em;
				font-weight: 600;
			}

			.degree {
				font-size: 0.7em;
				vertical-align: top;
			}
		} // .temp

	} // .box

}
</style>
