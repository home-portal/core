<template>
	<div id="notifications">
		<div class="notification-container">
			<div class="notification-message severity-info">
				<div class="section">
					<div class="icon">
						<i class="fas fa-info-circle"></i>
					</div>
					<div class="content">
						<div class="title">Did you know?</div>
						<div class="description">
							Here is something that you might like to know.
						</div>
					</div>
					<div class="close">
						<i class="fas fa-times"></i>
					</div>
				</div>
				<div class="actions">
					<div class="button">Cancel</div>
					<div class="button">OK</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {}
};
</script>

<style lang="scss" scoped>
.notification-container {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background: rgba(black, 0.6);

	display: flex;
	justify-content: center;
	align-items: center;
}

.notification-message {
	max-width: 80%;
	background: white;
	border-radius: 8px;
	box-shadow: 0 0 20px rgba(black, 0.8);
	color: black;
	font-size: 1.5rem;
	padding: 0.5em;

	.section {
		display: flex;
		align-items: center;

		.indicator {
			margin: 0.25em;
			background: #007bc2;
			width: 8px;
			border-radius: 4px;
		}

		.icon {
			margin: 0 0.5em;
			font-size: 1.5em;
			color: #007bc2;
		}

		.content {
			flex: 1;
			.title {
				font-weight: bold;
			}

			.description {
				color: #888;
				font-weight: normal;
				font-size: 0.8em;
			}
		}

		.close {
			margin: 0 0.5em;
			margin-left: 1em;
			color: #888;
		}
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		font-size: 0.8em;
		margin-top: 1em;

		$c: #007bc2;

		.button {
			min-width: 120px;
			margin: 0 0.5em;
			padding: 0.5em 1em;
			cursor: pointer;
			background-color: $c;
			color: white;
			font-weight: normal;
			text-align: center;
			border-radius: 0.5em;

			transition: background-color 0.2s;

			&:hover {
				background-color: darken($c, 10%);
			}

			&:active {
				box-shadow: none;
				transform: translate(2px, 2px);
			}
		}
	}
}
</style>
