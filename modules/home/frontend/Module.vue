<template>
	<div class="page">
		<div class="overlay"></div>
		<div class="page-title">Home Portal</div>
		<div class="page-content">
			<div class="header">
				<div class="functions">
					<div class="btn btn-today">
						<i class="fa fa-play"></i>
					</div>
					<div class="btn btn-settings">
						<i class="fa fa-cog"></i>
					</div>
				</div>
			</div>
			<div class="widgets layout-2x2">
				<div class="widget w1">
					<div class="panel date-time">
						<div class="time">{{ time }}</div>
						<div class="date">{{ date }}</div>
					</div>
				</div>

				<div class="widget w2">
					<div class="panel date-time">
						<div class="time">{{ time }}</div>
						<div class="date">{{ date }}</div>
					</div>
				</div>

				<div class="widget w3">
					<div class="panel date-time">
						<div class="time">{{ time }}</div>
						<div class="date">{{ date }}</div>
					</div>
				</div>

				<div class="widget w4">
					<div class="panel date-time">
						<div class="time">{{ time }}</div>
						<div class="date">{{ date }}</div>
					</div>
				</div>

				<div class="widget w5">
					<div class="panel date-time">
						<div class="time">{{ time }}</div>
						<div class="date">{{ date }}</div>
					</div>
				</div>

				<div class="widget w6">
					<div class="panel date-time">
						<div class="time">{{ time }}</div>
						<div class="date">{{ date }}</div>
					</div>
				</div>
			</div>

			<div class="panel footer">
				<div class="toolbar">
					<div class="item">
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
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module.
const moment = HomePortal.dependencies.moment;
const gsap = HomePortal.dependencies.gsap;

export default {
	data() {
		return {
			timer: null,
			date: null,
			time: null
		};
	},

	methods: {
		update() {
			this.time = moment().format("LT");
			this.date = moment().format("LL");
		}
	},

	created() {
		this.update();
		this.timer = setInterval(() => this.update(), 10 * 1000);
	},

	events: {
		"module-home.activated"() {
			console.log("Home module activated");
			let tl = gsap.timeline(); //create the timeline

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
				{ y: 100, opacity: 0, scale: 0.2 },
				{
					y: 0,
					opacity: 1,
					scale: 1,
					delay: 1,
					duration: 1,
					ease: "elastic.out(1, 0.5)",
					stagger: 0.1
				}
			);

			gsap.fromTo(
				this.$el.querySelectorAll(".functions .btn"),
				{ y: -100 },
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

		"module-home.deactivated"() {
			console.log("Home module deactivated");
			gsap.to(this.$el.querySelectorAll(".widgets .widget"), {
				visibility: "hidden",
				duration: 0.5
			});
			gsap.to(this.$el.querySelector(".footer"), { visibility: "hidden", duration: 0.5 });
			gsap.to(this.$el.querySelectorAll(".functions .btn"), {
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

.header {
	display: flex;
	justify-content: flex-end;

	.functions {
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
}

.footer {
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

		.panel.date-time {
			display: flex;
			flex-direction: column;
			border-radius: var(--panelRadius);

			.time {
				flex: 1;
				font-size: 5em;
				line-height: 1.2em;
				text-align: center;
			}

			.date {
				background-color: var(--bg1);
				font-size: 1.5rem;
				line-height: 2.5rem;
				text-align: center;
				border-radius: 0 0 var(--panelRadius) var(--panelRadius);
			}
		}
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
