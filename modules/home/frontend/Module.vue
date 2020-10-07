<template>
	<div class="page">
		<div class="overlay"></div>
		<div class="wrapper">
			<div class="page-header">
				<div class="title">
					<span>Home Portal</span>
				</div>
				<div class="action-bar">
					<div class="btn btn-today">
						<i class="fa fa-play"></i>
					</div>
					<div class="btn btn-settings">
						<i class="fa fa-cog"></i>
					</div>
				</div>
			</div>

			<div class="page-content">
				<div class="widgets layout-2x2">
					<div class="widget w1"></div>

					<div class="widget w2"></div>

					<div class="widget w3"></div>

					<div class="widget w4"></div>

					<div class="widget w5"></div>

					<div class="widget w6"></div>
				</div>

				<div class="panel footer">
					<div class="toolbar">
						<div class="item" @click="broker.call('$router.goTo', { page: 'weather' })">
							<i class="fa fa-cloud-sun"></i>
							<div class="title"></div>
						</div>
						<div class="item">
							<i class="fa fa-calendar-alt"></i>
							<div class="title"></div>
						</div>
						<div class="item" @click="broker.call('$router.goTo', { page: 'traffic' })">
							<i class="fa fa-globe-americas"></i>
							<div class="title"></div>
						</div>
						<div class="item">
							<i class="fa fa-tasks"></i>
							<div class="title"></div>
						</div>
						<div class="item">
							<i class="fa fa-video"></i>
							<div class="title"></div>
						</div>
						<div class="item">
							<i class="fa fa-newspaper"></i>
							<div class="title"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module.
const moment = HomePortal.dependencies.moment;
const gsap = HomePortal.dependencies.gsap;

export default {
	data() {
		return {
			settings: {}, // mixin
			timer: null,
			date: null,
			time: null
		};
	},

	methods: {
		update() {
			this.time = moment().format("LT");
			this.date = moment().format("LL");
		},

		loadWidgets() {
			const widgets = this.settings.widgets;
			if (widgets && widgets.length > 0) {
				console.log("Loading widgets...");
				const len = Math.min(widgets.length, 6);
				for (let i = 0; i < len; i++) {
					const widget = HomePortal.getWidget(widgets[i]);
					if (widget) {
						console.log("Loading widget...", widget);
						try {
							let container = this.$el.querySelector(`.widget.w${i + 1}`);
							if (_.isFunction(widget.mountDiv)) {
								const div = document.createElement("div");
								container.appendChild(div);
								widget.content = widget.mountDiv(div);
							} else if (_.isFunction(widget.mount)) {
								widget.content = widget.mount(container);
							} else {
								console.warn(`No 'mount' or 'mountDiv' method in widget '${widget.name}'`, widget);
							}
						} catch (err) {
							console.error("Unable to render widget", err, widget);
						}
					}
				}
			}
		}
	},

	created() {
		this.settings = HomePortal.getModuleSettings("home");
		console.log("Module settings", this.settings);

		this.update();
		this.timer = setInterval(() => this.update(), 10 * 1000);
	},

	mounted() {
		this.loadWidgets();
	},

	events: {
		"page-home.activated"() {
			gsap.fromTo(
				this.$el.querySelectorAll(".widgets .widget"),
				{ y: -100, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					delay: 0.2,
					duration: 1,
					visibility: "visible",
					ease: "elastic.out(1, 0.5)",
					stagger: 0.25
				}
			);

			gsap.fromTo(
				this.$el.querySelector(".footer"),
				{ y: 100 },
				{
					y: 0,
					delay: 0.5,
					duration: 1.5,
					visibility: "visible",
					ease: "elastic.out(1, 0.5)"
				}
			);
			gsap.fromTo(
				this.$el.querySelectorAll(".footer .toolbar .item"),
				{ opacity: 0, scale: 0.2 },
				{
					opacity: 1,
					scale: 1,
					delay: 1,
					duration: 1,
					ease: "elastic.out(1, 0.5)",
					stagger: 0.2
				}
			);

			gsap.fromTo(
				this.$el.querySelectorAll(".action-bar .btn"),
				{ y: 100 },
				{
					y: 0,
					delay: 1,
					duration: 2,
					visibility: "visible",
					ease: "elastic.out(1, 0.5)",
					stagger: 0.25
				}
			);
		},

		"page-home.deactivated"() {
			gsap.to(this.$el.querySelectorAll(".widgets .widget"), {
				visibility: "hidden",
				duration: 0.5
			});
			gsap.to(this.$el.querySelector(".footer"), { visibility: "hidden", duration: 0.5 });
			gsap.to(this.$el.querySelectorAll(".action-bar .btn"), {
				visibility: "hidden",
				duration: 0.5
			});
		}
	},

	beforeDestroy() {
		if (this.timer) clearInterval(this.timer);
	}
};
</script>

<style lang="scss" scoped>
.page {
	background-image: url("./images/background.jpg");
}

.page-content {
	display: flex;
	flex-direction: column;
}

.action-bar {
	position: absolute;
	top: 0;
	right: 0;

	padding: 0.3em;
	display: flex;

	> div {
		margin: 0 0.75rem;
		font-size: 2em;
		cursor: pointer;
		color: var(--primary);
		visibility: hidden;

		opacity: 0.3;
		transition: opacity 0.2s linear;

		&:hover {
			opacity: 0.8;
		}
	}
}

.footer {
	margin-top: 0.5em;
	display: flex;
	justify-content: center;
	flex-direction: column;
	visibility: hidden;

	.toolbar {
		padding: 0.75em 0;

		display: flex;
		justify-content: space-around;

		.item {
			flex: 1;
			font-size: 2.5em;
			text-align: center;
			cursor: pointer;

			i {
				border: 0.15em solid var(--bg1);
				border-radius: 50%;
				width: 2em;
				height: 2em;
				line-height: 1.7em;

				color: white;
				transition: background-color 0.2s linear;
			}

			.title {
				font-size: 1rem;
				text-align: center;
				text-transform: uppercase;
				visibility: hidden;
			}

			&:hover {
				i {
					background-color: var(--bg1);
				}
			}
		}
	}
}

@for $i from 1 through 10 {
	.widget.w#{$i} {
		grid-area: w#{$i};
	}
}

.widgets {
	flex: 1;
	overflow: hidden;
	display: grid;
	grid-gap: 0em;

	&.layout-2x2 {
		grid-template-columns: auto auto;
		grid-template-areas:
			"w1 w2"
			"w3 w4";

		@for $i from 5 through 10 {
			.widget.w#{$i} {
				display: none;
			}
		}
	}

	&.layout-3x2 {
		grid-template-columns: auto auto auto;
		grid-template-areas:
			"w1 w2 w3"
			"w4 w5 w6";

		@for $i from 7 through 10 {
			.widget.w#{$i} {
				display: none;
			}
		}
	}

	.widget {
		padding: 0.8em;
		max-height: 100%;
		overflow: hidden;
		visibility: hidden;
	}
}

@media (orientation: portrait) {
	.widgets {
		grid-gap: 0em;

		&.layout-2x2 {
			grid-template-columns: auto;
			grid-template-areas:
				"w1"
				"w2"
				"w3"
				"w4";
		}

		&.layout-3x2 {
			grid-template-columns: auto auto;
			grid-template-areas:
				"w1 w2"
				"w3 w4"
				"w5 w6";
		}
	}
}
</style>
