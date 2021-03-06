<template>
	<div v-if="visible" class="dialog">
		<div class="dialog-overlay" @click="close"></div>
		<div class="dialog-container">
			<div class="dialog-title">
				<div class="icon">
					<i class="fa fa-power-off"></i>
				</div>
				<span>Power options</span>
				<div class="close" @click="close">
					<i class="fa fa-times"></i>
				</div>
			</div>
			<div class="dialog-content">
				<slot>
					<div class="buttons">
						<div class="button" @click="exitApplication">Exit Home Portal</div>
						<div class="button" @click="restartDevice">Restart device</div>
						<div class="button" @click="powerOffDevice">Power off device</div>
					</div>
				</slot>
			</div>
		</div>
	</div>
</template>

<script>
const gsap = HomePortal.dependencies.gsap;

export default {
	props: [],
	data() {
		return {
			visible: false,
			timer: null
		};
	},

	methods: {
		show() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}

			this.timer = setTimeout(()=> this.close(), 10 * 1000);

			this.visible = true;
			this.$nextTick(() => {
				gsap.fromTo(
					this.$el.querySelectorAll(".dialog-overlay"),
					{ opacity: 0 },
					{
						opacity: 1,
						duration: .5,
						ease: "power4.out"
					}
				);
				gsap.fromTo(
					this.$el.querySelectorAll(".dialog-container"),
					{ opacity: 0, scale: 0.2 },
					{
						opacity: 1,
						scale: 1,
						duration: .5,
						ease: "power4.out"
					}
				);
			});
		},

		close() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}

			gsap.to(
				this.$el.querySelectorAll(".dialog-container"),
				{
					opacity: 0,
					scale: 0,
					duration: .5,
					ease: "power2.out",
					onComplete: () => this.visible = false
				}
			);
			gsap.to(
				this.$el.querySelectorAll(".dialog-overlay"),
				{
					opacity: 0,
					duration: .5,
					ease: "power2.out",
					onComplete: () => this.visible = false
				}
			);
		},

		async exitApplication() {
			try {
				await this.broker.call("os.exit");
			} catch(err) {
				console.log(err);
			}
		},

		async restartDevice() {
			try {
				await this.broker.call("os.reboot");
			} catch(err) {
				console.log(err);
			}
		},

		async powerOffDevice() {
			try {
				await this.broker.call("os.powerOff");
			} catch(err) {
				console.log(err);
			}
		},

	}
}
</script>

<style lang="scss" scoped>
.dialog {
	$c: #787885;
	$textColor: white;

/*
	&.positive {
		$c: #65B168;
		$textColor: white;
	}

	&.blue {
		$c: #5983cc;
		$textColor: white;
	}

	&.negative {
		$c: #ca6860;
		$textColor: white;
	}

	&.white {
		$c: white;
		$textColor: black;
	}*/

	position: absolute;
	left: 0; right: 0; top: 0; bottom: 0;
	display: flex;

	.dialog-overlay {
		position: absolute;
		left: 0; right: 0; top: 0; bottom: 0;
		background: rgba(black, 0.5);
	}

	.dialog-container {
		z-index: 100;
		// position: absolute;
		// left: 0; right: 0; top: 0; bottom: 0;

		width: auto;
		margin: auto;

		font-size: 1.25rem;
		background-color: $c;
		color: $textColor;
		box-shadow: 0 0 20px rgba(black, 0.9);

		border-radius: 0.5em;
		text-shadow: 1px 1px 3px rgba(black, 0.6);

		.dialog-title {
			display: flex;
			align-items: baseline;

			background-color: darken($c, 8%);
			border-radius: 0.5em 0.5em 0 0;
			padding: 0.25em 0.5em;
			font-size: 1.0em;
			font-weight: normal;
			//border-bottom: 1px solid #96969e;
			box-shadow: 0 1px 8px rgba(black, 0.4);

			.icon {
				color: rgba($textColor, 0.6);
				margin-right: 0.5em;
				font-size: 0.8em;
			}

			span {
				flex: 1;
			}

			.close {
				cursor: pointer;
				color: #b5b5b5;
				transition: color .2s;

				&:hover {
					color: rgba($textColor, 0.6);
				}
			}
		}

		.dialog-content {
			padding: 0.5em;

			.buttons {
				padding: 0 1em;

				.button {
					cursor: pointer;
					margin: 1em 0;
					padding: 0.5em 2em;
					background-color: darken($c, 15%);
					text-align: center;
					box-shadow: 1px 1px 3px rgba(black, 0.6);
					border-radius: 0.5em;

					transition: background-color .2s;

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
	}

}
</style>
