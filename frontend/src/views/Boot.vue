<template>
	<div class="page" data-page="boot">
		<div class="content">
			<boot-spinner />
			<div class="labels">
				<div class="title">Home Portal</div>
				<div v-if="error" class="status error">
					<span>{{ error }}</span>
				</div>
				<div v-else class="status">
					<span>{{ status }}...</span>
					<div class="cursor"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import BootSpinner from "../components/BootSpinner";
export default {
	name: "BootScreen",

	components: {
		BootSpinner
	},

	data() {
		return {
			status: "Booting...",
			error: null
		};
	},

	methods: {
		updateStatus(text, isError) {
			if (isError)
			this.error = text;
			else
			this.status = text;
		}
	}
};
</script>

<style lang="scss" scoped>

.page {
	display: flex;
	justify-content: center;
	align-items: center;
}

.labels {
	text-align: center;
	position: relative;
	font-size: 1.5em;
	line-height: 1.6em;
	margin-top: 0.6em;
	text-shadow: 1px 1px 2px #000;

	.title,
	.status {
		vertical-align: bottom;
		text-shadow: 0 0 15px #bce4ff;

		&.status {
			margin-left: 0.5em;
			font-size: 0.75em;

			&.error {
				color: #ff4e4e;
				text-shadow: 0 0 15px #ff4e4e;
			}
		}
	}

	.cursor {
		display: inline-block;
		margin-left: 4px;
		height: 0.8em;
		width: 0.5em;
		background: #dce4ec;
		box-shadow: 0 0 15px #bce4ff;
		animation: blink 0.5s infinite;
		vertical-align: baseline;
	}
}
</style>
