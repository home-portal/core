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
						<div class="title"><i class="fa fa-clock"></i> Menetidő</div>
						<div class="value highlight">{{ time }}</div>
					</div>
					<div class="row">
						<div class="title"><i class="fa fa-road"></i> Távolság</div>
						<div class="value">{{ distance }}</div>
					</div>
					<div class="row divider"></div>
					<div class="row">
						<div class="title"><i class="fa fa-car"></i> Forgalom nélkül</div>
						<div class="value dim">{{ timeNoTraffic }}</div>
					</div>
					<div class="row">
						<div class="title"><i class="fa fa-traffic-light"></i> Forgalom</div>
						<div :class="'value ' + trafficClass">{{ trafficLabel }}</div>
					</div>
					<div class="row divider"></div>
					<div class="row">
						<div class="title"><i class="fa fa-sign-out-alt"></i> Indulás</div>
						<div class="value">{{ departureTime }}</div>
					</div>
					<div class="row">
						<div class="title"><i class="fa fa-map-marker-alt"></i> Érkezés</div>
						<div class="value highlight">{{ arrivalTime }}</div>
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
			settings: {},
			map: null,
			routePolyline: null,
			time: "-",
			distance: "-",
			timeNoTraffic: "-",
			trafficLabel: "-",
			trafficClass: "",
			departureTime: "-",
			arrivalTime: "-",
			durationSec: 0
		};
	},

	methods: {
		loadGoogleMaps() {
			// If Google Maps is already loaded, resolve immediately
			if (typeof google !== "undefined" && google.maps) {
				return Promise.resolve();
			}
			return new Promise(resolve => {
				window.initTrafficMap = function () {
					console.log("Google maps API loaded.");
					resolve();
				};
				HomePortal.loadScriptFile(
					`https://maps.googleapis.com/maps/api/js?key=${this.settings.apiKey}&libraries=geometry&callback=initTrafficMap`
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
		},

		formatDuration(seconds) {
			const h = Math.floor(seconds / 3600);
			const m = Math.floor((seconds % 3600) / 60);
			if (h > 0) return `${h} ó ${m} p`;
			return `${m} perc`;
		},

		formatDistance(meters) {
			if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
			return `${meters} m`;
		},

		async fetchRoute(homeAddress, workAddress, routingPreference) {
			const response = await fetch(
				"https://routes.googleapis.com/directions/v2:computeRoutes",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Goog-Api-Key": this.settings.apiKey,
						"X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
					},
					body: JSON.stringify({
						origin: { address: homeAddress },
						destination: { address: workAddress },
						travelMode: "DRIVE",
						routingPreference
					})
				}
			);
			const data = await response.json();
			if (data.error) throw new Error(data.error.message);
			return data.routes?.[0];
		},

		async calcRouteToWork() {
			const { homeAddress, workAddress, showRoutesOnMap } = this.settings.routeToWork;

			try {
				// Fetch both traffic-aware and traffic-unaware routes in parallel
				const [trafficRoute, baseRoute] = await Promise.all([
					this.fetchRoute(homeAddress, workAddress, "TRAFFIC_AWARE"),
					this.fetchRoute(homeAddress, workAddress, "TRAFFIC_UNAWARE")
				]);

				if (!trafficRoute) {
					this.time = "Hiba";
					return;
				}

				// Traffic-aware duration
				const durationSec = parseInt(trafficRoute.duration);
				if (!isNaN(durationSec)) {
					this.durationSec = durationSec;
					this.time = this.formatDuration(durationSec);
				}

				// Distance
				if (trafficRoute.distanceMeters) {
					this.distance = this.formatDistance(trafficRoute.distanceMeters);
				}

				// Traffic-unaware (base) duration
				if (baseRoute) {
					const baseSec = parseInt(baseRoute.duration);
					if (!isNaN(baseSec)) {
						this.timeNoTraffic = this.formatDuration(baseSec);

						// Traffic level based on delay ratio
						const delay = durationSec - baseSec;
						const ratio = durationSec / baseSec;
						if (ratio <= 1.1) {
							this.trafficLabel = "Szabad";
							this.trafficClass = "traffic-free";
						} else if (ratio <= 1.3) {
							this.trafficLabel = `Mérsékelt (+${this.formatDuration(delay)})`;
							this.trafficClass = "traffic-moderate";
						} else if (ratio <= 1.6) {
							this.trafficLabel = `Sűrű (+${this.formatDuration(delay)})`;
							this.trafficClass = "traffic-heavy";
						} else {
							this.trafficLabel = `Dugó (+${this.formatDuration(delay)})`;
							this.trafficClass = "traffic-jam";
						}
					}
				}

				// Departure & arrival times
				const now = moment();
				this.departureTime = now.format("H:mm");
				this.arrivalTime = "~" + now.add(durationSec, "seconds").format("H:mm");

				// Draw route on map
				if (showRoutesOnMap && trafficRoute.polyline?.encodedPolyline) {
					if (this.routePolyline) this.routePolyline.setMap(null);

					const path = google.maps.geometry.encoding.decodePath(trafficRoute.polyline.encodedPolyline);
					this.routePolyline = new google.maps.Polyline({
						path,
						strokeColor: "#4285F4",
						strokeOpacity: 0.8,
						strokeWeight: 5
					});
					this.routePolyline.setMap(this.map);

					setTimeout(() => {
						this.map.setCenter(this.settings.center);
						this.map.setZoom(this.settings.zoom);
					}, 1000);
				}
			} catch (err) {
				console.error("Route calculation failed:", err);
				this.time = "Hiba";
			}
		}
	},

	created() {
		this.settings = HomePortal.getModuleSettings("ui-traffic");
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
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0.5em 0;

		.row {
			line-height: 1.4;
			padding: 0.3em 0.8em;

			.title {
				text-align: center;
				font-size: 0.8em;
				font-weight: 300;
				color: lighten($c, 20%);

				i {
					margin-right: 0.3em;
					opacity: 0.7;
				}
			}

			.value {
				text-align: center;
				font-size: 1.2em;
				font-weight: 600;

				&.highlight {
					font-size: 1.5em;
					color: lighten($c, 30%);
					text-shadow: 0 0 10px rgba($c, 0.3);
				}

				&.dim {
					opacity: 0.6;
					font-size: 1em;
				}

				&.traffic-free {
					color: #4caf50;
				}
				&.traffic-moderate {
					color: #ff9800;
				}
				&.traffic-heavy {
					color: #f44336;
				}
				&.traffic-jam {
					color: #d32f2f;
					font-weight: 700;
				}
			}

			&.divider {
				border-top: 1px solid rgba(white, 0.1);
				margin: 0.2em 1.5em;
				padding: 0;
			}
		}
	}
}
</style>
