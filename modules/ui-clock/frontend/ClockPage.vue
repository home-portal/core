<template>
	<div class="page" @click="goHome">
		<svg :class="'color-' + colorID" viewBox="0 0 800 480">
			<defs>
				<pattern
					id="dotPattern"
					x="0"
					y="0"
					width="10"
					height="10"
					patternUnits="userSpaceOnUse"
				>
					<circle cx="5" cy="5" r="2" class="bgDot"></circle>
				</pattern>
				<radialGradient id="backHoleBelowClock" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
					<stop offset="50%" style="stop-color: rgb(0, 0, 0); stop-opacity: 0.7"></stop>
					<stop offset="100%" style="stop-color: rgb(0, 0, 0); stop-opacity: 0"></stop>
				</radialGradient>
				<radialGradient id="blackVignette" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
					<stop offset="20%" style="stop-color: rgb(0, 0, 0); stop-opacity: 0"></stop>
					<stop offset="60%" style="stop-color: rgb(0, 0, 0); stop-opacity: 1"></stop>
				</radialGradient>
				<filter id="glow">
					<feGaussianBlur stdDeviation="2.5" result="coloredBlur"></feGaussianBlur>
					<feMerge>
						<feMergeNode in="coloredBlur"></feMergeNode>
						<feMergeNode in="SourceGraphic"></feMergeNode>
					</feMerge>
				</filter>
				<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur
						in="SourceAlpha"
						stdDeviation="3"
						result="shadow"
					></feGaussianBlur>
					<feOffset dx="1" dy="1"></feOffset>
					<feMerge>
						<feMergeNode></feMergeNode>
						<feMergeNode in="SourceGraphic"></feMergeNode>
					</feMerge>
				</filter>
			</defs>
			<!-- Background objects-->
			<rect
				x="-1000"
				y="-1000"
				width="2000"
				height="2000"
				style="stroke: #000000; fill: url(#dotPattern)"
			></rect>
			<ellipse cx="550" cy="240" rx="300" ry="300" fill="url(#backHoleBelowClock)"></ellipse>
			<ellipse cx="550" cy="240" rx="1200" ry="1200" fill="url(#blackVignette)"></ellipse>

			<!-- Clock objects-->
			<circle cx="550" cy="240" r="150" stroke-width="6" class="clockCircle hour"></circle>
			<path filter="url(#glow)" class="clockArc hour" />
			<circle
				r="8"
				filter="url(#glow)"
				class="clockDot hour"
				cx="443.01243262687274"
				cy="134.86361035502236"
			></circle>
			<circle cx="550" cy="240" r="170" stroke-width="3" class="clockCircle minute"></circle>
			<path filter="url(#glow)" class="clockArc minute"></path>
			<circle
				r="5"
				filter="url(#glow)"
				class="clockDot minute"
				cx="567.769838755501"
				cy="409.0687222126064"
			></circle>

			<!-- Caption objects-->
			<text
				class="caption timeText"
				x="550"
				y="240"
				stroke-width="0"
				text-anchor="middle"
				alignment-baseline="middle"
				filter="url(#shadow)"
			>
				{{ timeStr }}
			</text>
			<text
				class="caption dayText"
				x="300"
				y="210"
				stroke-width="0"
				text-anchor="end"
				alignment-baseline="middle"
				filter="url(#shadow)"
			>
				{{ weekOfDayStr }}
			</text>
			<text
				class="caption dateText"
				x="300"
				y="250"
				stroke-width="0"
				text-anchor="end"
				alignment-baseline="middle"
				filter="url(#shadow)"
			>
				{{ dateStr }}
			</text>

			<!-- Current weather -->
			<text
				class="weatherIcon"
				x="300"
				y="330"
				stroke-width="0"
				text-anchor="end"
				alignment-baseline="middle"
				filter="url(#shadow)"
			>{{ weatherIcon }}
			</text>

			<text
				class="caption weatherTemperature"
				x="275"
				y="380"
				stroke-width="0"
				text-anchor="end"
				alignment-baseline="middle"
				filter="url(#shadow)"
			>
				{{ temperatureStr }}
			</text>
			<text
				class="caption weatherTempUnit"
				x="280"
				y="370"
				stroke-width="0"
				text-anchor="start"
				alignment-baseline="middle"
				filter="url(#shadow)"
			>
				{{ tempUnit }}
			</text>
		</svg>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module, too.
const moment = HomePortal.dependencies.moment;
const gsap = HomePortal.dependencies.gsap;

const COLOR_COUNT = 4;
const ANIMATION_TIME = 1;

const centerX = 550;
const centerY = 240;
const radiusHour = 150;
const radiusMin = 170;

// https://github.com/parcel-bundler/parcel/issues/2561#issuecomment-456442109
export default {
	name: "ClockPage",

	computed: {
		tempUnit() {
			return this.weatherData?.unit == "imperial" ? "°F" : "°C";
		},

		weatherIcon() {
			return window.HomePortal.utils.getWeatherIconByType(this.weatherData?.current?.icon, "unicode");
		}
	},

	data() {
		return {
			settings: null,

			weatherData: null,
			eventData: null,

			timer: null,

			oldHourArc: 0,
			oldMinArc: 0,

			colorID: 0,

			timeStr: null,
			weekOfDayStr: null,
			dateStr: null,

			temperatureStr: null
		};
	},

	methods: {
		goHome() {
			HomePortal.goHome();
		},

		polarToCartesian(centerX, centerY, radius, angleInDegrees) {
			const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
			return {
				x: centerX + radius * Math.cos(angleInRadians),
				y: centerY + radius * Math.sin(angleInRadians)
			};
		},

		describeArc(x, y, radius, startAngle, endAngle) {
			const start = this.polarToCartesian(x, y, radius, endAngle);
			const end = this.polarToCartesian(x, y, radius, startAngle);
			const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
			return ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y].join(
				" "
			);
		},

		update() {
			const now = moment();
			const hour = now.hours() % 12;
			const minute = now.minutes();
			const second = now.seconds();
			const hourArc = ((hour * 60 + minute) / (12 * 60)) * 360;
			const minArc = (minute / 60) * 360;
			// minArc = (minute * 60 + second) / (60 * 60) * 360

			// Select color by hour
			this.colorID = hour % COLOR_COUNT;

			const tl = gsap.timeline();

			const clockArcHour = document.querySelector(".clockArc.hour");
			if (clockArcHour) {
				this.animateArc(tl, clockArcHour, this.oldHourArc, hourArc, radiusHour, 0);

				const clockDotHour = document.querySelector(".clockDot.hour");
				this.animateDot(
					tl,
					clockDotHour,
					this.oldHourArc,
					hourArc,
					radiusHour,
					-ANIMATION_TIME
				);
				const clockArcMinute = document.querySelector(".clockArc.minute");
				this.animateArc(
					tl,
					clockArcMinute,
					this.oldMinArc,
					minArc,
					radiusMin,
					-(ANIMATION_TIME * 0.8)
				);

				const clockDotMinute = document.querySelector(".clockDot.minute");
				this.animateDot(tl, clockDotMinute, this.oldMinArc, minArc, radiusMin, -(ANIMATION_TIME * 0.8));

				this.oldHourArc = hourArc;
				this.oldMinArc = minArc;
			}

			this.timeStr = now.format(this.settings?.timeFormat || "H:mm");
			this.weekOfDayStr = now.format("dddd");
			this.dateStr = now.format(this.settings?.dateFormat || "MMMM D");

			this.temperatureStr = this.weatherData?.current?.temperature ? Math.round(this.weatherData.current.temperature) : null;
		},

		animateArc(tl, el, oldArc, newArc, radius, delay) {
			const o = {
				arc: oldArc
			};

			tl.to(o, ANIMATION_TIME, {
				arc: newArc,
				onUpdate: () =>
					el.setAttribute("d", this.describeArc(centerX, centerY, radius, 0, o.arc)),
				ease: "power2.inOut",
				delay: delay
			});
		},

		animateDot(tl, el, oldArc, newArc, radius, delay) {
			const o = {
				arc: oldArc
			};
			tl.to(o, ANIMATION_TIME, {
				arc: newArc,
				onUpdate: () => {
					const pos = this.polarToCartesian(centerX, centerY, radius, o.arc);
					el.setAttribute("cx", pos.x);
					el.setAttribute("cy", pos.y);
				},
				ease: "power2.inOut",
				delay: delay
			});
		}
	},

	events: {
		"current.weather.updated"(ctx) {
			this.weatherData = ctx.params;
		},

		"current.events.updated"(ctx) {
			this.eventData = ctx.params;
		},
		"page-clock.activated"() {
			this.update();
		}
	},

	created() {
		this.settings = HomePortal.getModuleSettings("ui-clock");
		console.log("Module settings", this.settings);
	},

	async mounted() {
		this.weatherData = await this.broker.call("current.get", { key: "weather" });
		this.eventData = await this.broker.call("current.get", { key: "events" });

		this.update();
		this.timer = setInterval(() => this.update(), 5 * 1000);
	},

	beforeDestroy() {
		if (this.timer) clearInterval(this.timer);
	}
};
</script>

<style lang="scss" scoped>
$forestGreen: rgb(0, 255, 84);
$cityAqua: rgb(0, 233, 233);
$skyBlue: rgb(0, 181, 255);
$deepPurple: rgb(164, 49, 230);
$islandOrange: rgb(255, 49, 0);
$beachOrange: rgb(255, 97, 0);

.page {
	$mainColor: #1bbccb; // Blue
	$bgColor: #215769;

	$greyColor: #2a2a2a;
	$textColor: White;

	$fontClock: "Roboto";
	$fontCaptions: "Roboto";

	svg {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;

		background-image: linear-gradient(Black 60%, $bgColor 100%);

		border-radius: 10px;
		box-shadow: 0 0 50px rgba(Black, 0.8);

		.bgDot {
			stroke: none;
			fill: $bgColor;
		}

		.clockCircle {
			fill: none;
			stroke: $greyColor;
		}

		.clockArc {
			fill: none;
			stroke: $mainColor;
			stroke-width: 6;
			stroke-linecap: round;

			&.minute {
				stroke-width: 3;
			}
		}

		.clockDot {
			fill: lighten($mainColor, 50%);
		}

		.caption {
			font-family: $fontCaptions;
			font-weight: 300;
			fill: $textColor;
		}

		.dayText {
			font-size: 27px;
		}

		.dateText {
			font-size: 40px;
			font-weight: 400;
		}

		.timeText {
			font-family: $fontClock;
			font-size: 80px;
			font-weight: 400;
			fill: $textColor;
		}

		.weatherIcon {
			font-family: "weathericons";
			font-size: 40px;
			fill: $textColor;
		}

		.weatherTemperature {
			font-size: 35px;
			font-weight: 400;
		}

		.weatherTempUnit {
			font-size: 18px;
		}

		&.color-1 {
			$mainColor: #de9235; // Orange
			$bgColor: darken($mainColor, 25%);

			background-image: linear-gradient(Black 60%, $bgColor 100%);

			.bgDot {
				fill: $bgColor;
			}

			.clockArc {
				stroke: $mainColor;
			}

			.clockDot {
				fill: lighten($mainColor, 50%);
			}
		} // &.color-1

		&.color-2 {
			$mainColor: $forestGreen; // Green
			$bgColor: darken($mainColor, 25%);

			background-image: linear-gradient(Black 60%, $bgColor 100%);

			.bgDot {
				fill: $bgColor;
			}

			.clockArc {
				stroke: $mainColor;
			}

			.clockDot {
				fill: lighten($mainColor, 50%);
			}
		} // &.color-2

		&.color-3 {
			$mainColor: $beachOrange; // Red
			$bgColor: darken($mainColor, 25%);

			background-image: linear-gradient(Black 60%, $bgColor 100%);

			.bgDot {
				fill: $bgColor;
			}

			.clockArc {
				stroke: $mainColor;
			}

			.clockDot {
				fill: lighten($mainColor, 50%);
			}
		} // &.color-3
	} // svg
} // .page-base-clock
</style>
