<template>
	<div class="page">
		<div class="overlay"></div>
		<div class="wrapper">
			<div class="page-header">
				<div class="title">
					<span>Traffic map</span>
				</div>
				<div class="back-button" @click="broker.call('$router.goHome')"></div>
			</div>
			<div class="page-content">
				<div class="map"></div>
				<div class="infobox">
					<div class="row">
						<div class="title">Time</div>
						<div class="value">{{ time }}</div>
					</div>
					<div class="row">
						<div class="title">Distance</div>
						<div class="value">{{ distance }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// Get the dependencies from the core, so it won't be bundled into the module, too.
const moment = HomePortal.dependencies.moment;
const gsap = HomePortal.dependencies.gsap;

export default {
	data() {
		return {
			settings: {}, // mixin
			map: null,
			directionsService: null,
			directionsRenderer: null,
			time: "-",
			distance: "-"
		};
	},

	methods: {
		loadGoogleMaps() {
			return new Promise(resolve => {
				window.initTrafficMap = function () {
					console.log("Google maps API loaded.");
					resolve();
				};
				HomePortal.loadScriptFile(
					`https://maps.googleapis.com/maps/api/js?key=${this.settings.apiKey}&callback=initTrafficMap`
				);
			});
		},

		createMap() {
			this.map = new google.maps.Map(this.$el.querySelector(".map"), {
				center: this.settings.center,
				zoom: this.settings.zoom,

				styles: [
					{
						featureType: "all",
						elementType: "all",
						stylers: [
							{ invert_lightness: false },
							{ saturation: 20 },
							{ lightness: 10 },
							{ gamma: 0.5 },
							{ hue: "#90C2DC" }
						]
					},
					{
						featureType: "poi",
						elementType: "labels",
						stylers: [{ visibility: "off" }]
					}
				]
			});

			const trafficLayer = new google.maps.TrafficLayer();
			trafficLayer.setMap(this.map);

			if (this.settings.routeToWork && this.settings.routeToWork.enabled) {
				this.directionsService = new google.maps.DirectionsService();
				this.directionsRenderer = new google.maps.DirectionsRenderer();
				this.directionsRenderer.setMap(this.map);
			}
		},

		calcRouteToWork() {
			const request = {
				origin: this.settings.routeToWork.homeAddress,
				destination: this.settings.routeToWork.workAddress,
				travelMode: google.maps.TravelMode.DRIVING,
				durationInTraffic: true
			};
			this.directionsService.route(request, (result, status) => {
				if (status == google.maps.DirectionsStatus.OK) {
					if (result.routes[0] && result.routes[0].legs[0]) {
						if (result.routes[0].legs[0].duration)
							this.time = result.routes[0].legs[0].duration.value;
						if (result.routes[0].legs[0].distance)
							this.distance = result.routes[0].legs[0].distance.value;
					}

					if (this.settings.routeToWork.showRoutesOnMap) {
						this.directionsRenderer.setDirections(result);
						setTimeout(() => {
							this.map.setCenter(this.mapOptions.center);
							this.map.setZoom(this.mapOptions.zoom);
						}, 1000);
					}
				} else {
					// TODO: show a notification
					console.error(`Unable to show route. Status: ${status}`, result);
				}
			});
		}
	},

	created() {
		this.settings = HomePortal.getModuleSettings("ui-traffic");
		console.log("Module settings", this.settings);
	},

	mounted() {
		return this.loadGoogleMaps().then(() => {
			this.createMap();

			if (this.settings.routeToWork && this.settings.routeToWork.enabled)
				this.calcRouteToWork();
		});
	}
};
</script>

<style lang="scss" scoped>
$c: rgb(0, 181, 255); //var(--skyBlue);

.page {
	background-image: url("./images/background.jpg");
}

.overlay {
	background-color: rgba($c, 0.25);
}

.page-content {
	margin: 2em;
	display: flex;

	.map {
		flex: 4;
		border-radius: var(--panelRadius);
	}

	.infobox {
		margin-left: 1em;
		flex: 1;
		background-color: rgba(black, 0.5);
		border-radius: var(--panelRadius);

		.row {
			font-size: 1;
			line-height: 1.6;
			margin: 30px 0;

			.title {
				text-align: center;
				font-weight: 300;
				color: lighten($c, 20%);
			} // .title

			.value {
				text-align: center;
				font-weight: 600;
			} // .value
		}
	}
}
</style>
