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

			<div class="widgets">
				<div class="widget top-left">
					<div class="panel date-time">
						<div class="time">{{ time }}</div>
						<div class="date">{{ date }}</div>
					</div>
				</div>
			</div>

			<div class="panel toolbar">
				<div class="item">
					<i class="fa fa-cloud-sun"></i>
					<div class="title"></div>
				</div>
				<div class="item">
					<i class="fa fa-calendar-alt"></i>
					<div class="title"></div>
				</div>
				<div class="item">
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

	mounted() {
		this.$nextTick(() => {
			let tl = gsap.timeline(); //create the timeline

			gsap.fromTo(
				".widget.top-left",
				{ x: -100 },
				{ x: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }
			);
			gsap.fromTo(
				".panel.toolbar",
				{ y: 100 },
				{ y: 0, delay: 0.5, duration: 1.5, ease: "elastic.out(1, 0.5)" }
			);
			gsap.fromTo(
				".panel.toolbar .item",
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
				".functions .btn",
				{ y: -100 },
				{
					y: 0,
					delay: 1,
					duration: 2,
					ease: "elastic.out(1, 0.5)",
					stagger: 0.25
				}
			);
		});
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

.header {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	width: 100%;

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

			opacity: 0.3;
			transition: opacity 0.2s linear;

			&:hover {
				opacity: 0.8;
			}
		}
	}
}

.toolbar {
	position: absolute;
	width: 100%;
	bottom: 0;
	padding: 2% 0;

	display: flex;
	justify-content: space-around;

	// @media screen and (max-width: 500px) {
	// 	font-size: 0.8rem;
	// }

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
			display: none;
		}

		&:hover {
			i {
				background-color: var(--bg1);
			}
		}
	}
}

.widgets {
	.widget.top-left {
		position: absolute;
		top: 12%;
		left: 1em;
		width: 48%;
		height: 36%;

		.panel.date-time {
			display: flex;
			flex-direction: column;
			border-radius: var(--panelRadius);

			.time {
				font-size: 6em;
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
</style>
