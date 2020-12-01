export function getWeatherIconByType(type, responseType = "normal") {
	if (responseType == "unicode") {
		switch (type) {
			case "clear":
				return "\uf00d";
			case "few-clouds":
				return "\uf002";
			case "clouds":
				return "\uf07d";
			case "broken-clouds":
				return "\uf001";
			case "showers":
				return "\uf009";
			case "rain":
				return "\uf008";
			case "thunderstorm":
				return "\uf010";
			case "snow":
				return "\uf00a";
			case "fog":
				return "\uf003";

			case "night-clear":
				return "\uf02e";
			case "night-few-clouds":
				return "\uf086";
			case "night-clouds":
				return "\uf07e";
			case "night-broken-clouds":
				return "\uf023";
			case "night-showers":
				return "\uf037";
			case "night-rain":
				return "\uf036";
			case "night-thunderstorm":
				return "\uf03b";
			case "night-snow":
				return "\uf038";
			case "night-fog":
				return "\uf04a";

			default:
				return "\uf07b";
		}
	} else {
		const neutral = responseType == "neutral";
		switch (type) {
			case "clear":
				return neutral ? "wi-day-sunny" : "wi-day-sunny";
			case "few-clouds":
				return neutral ? "wi-cloud" : "wi-day-cloudy";
			case "clouds":
				return neutral ? "wi-cloudy" : "wi-day-cloudy-high";
			case "broken-clouds":
				return neutral ? "wi-cloudy-windy" : "wi-day-cloudy-windy";
			case "showers":
				return neutral ? "wi-showers" : "wi-day-showers";
			case "rain":
				return neutral ? "wi-rain" : "wi-day-rain";
			case "thunderstorm":
				return neutral ? "wi-thunderstorm" : "wi-day-thunderstorm";
			case "snow":
				return neutral ? "wi-snow" : "wi-day-snow";
			case "fog":
				return neutral ? "wi-fog" : "wi-day-fog";

			case "night-clear":
				return neutral ? "wi-clear" : "wi-night-clear";
			case "night-few-clouds":
				return neutral ? "wi-cloud" : "wi-night-cloudy";
			case "night-clouds":
				return neutral ? "wi-cloudy" : "wi-night-cloudy-high";
			case "night-broken-clouds":
				return neutral ? "wi-cloudy-windy" : "wi-night-cloudy-windy";
			case "night-showers":
				return neutral ? "wi-showers" : "wi-night-showers";
			case "night-rain":
				return neutral ? "wi-rain" : "wi-night-rain";
			case "night-thunderstorm":
				return neutral ? "wi-thunderstorm" : "wi-night-thunderstorm";
			case "night-snow":
				return neutral ? "wi-snow" : "wi-night-snow";
			case "night-fog":
				return neutral ? "wi-fog" : "wi-night-fog";

			default:
				return "wi-na";
		}
	}
}
