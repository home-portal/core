parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"../../traffic/frontend/TrafficPage.vue":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=HomePortal.dependencies.moment,t=HomePortal.dependencies.gsap,o={data:function(){return{settings:{},map:null,directionsService:null,directionsRenderer:null,time:"-",distance:"-"}},methods:{loadGoogleMaps:function(){var e=this;return new Promise(function(t){window.initTrafficMap=function(){console.log("Google maps API loaded."),t()},HomePortal.loadScriptFile("https://maps.googleapis.com/maps/api/js?key=".concat(e.settings.apiKey,"&callback=initTrafficMap"))})},createMap:function(){this.map=new google.maps.Map(this.$el.querySelector(".map"),{center:this.settings.center,zoom:this.settings.zoom,styles:[{featureType:"all",elementType:"all",stylers:[{invert_lightness:!1},{saturation:20},{lightness:10},{gamma:.5},{hue:"#90C2DC"}]},{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}]}),(new google.maps.TrafficLayer).setMap(this.map),this.settings.routeToWork&&this.settings.routeToWork.enabled&&(this.directionsService=new google.maps.DirectionsService,this.directionsRenderer=new google.maps.DirectionsRenderer,this.directionsRenderer.setMap(this.map))},calcRouteToWork:function(){var e=this,t={origin:this.settings.routeToWork.homeAddress,destination:this.settings.routeToWork.workAddress,travelMode:google.maps.TravelMode.DRIVING,durationInTraffic:!0};this.directionsService.route(t,function(t,o){o==google.maps.DirectionsStatus.OK?(t.routes[0]&&t.routes[0].legs[0]&&(t.routes[0].legs[0].duration&&(e.time=t.routes[0].legs[0].duration.value),t.routes[0].legs[0].distance&&(e.distance=t.routes[0].legs[0].distance.value)),e.settings.routeToWork.showRoutesOnMap&&(e.directionsRenderer.setDirections(t),setTimeout(function(){e.map.setCenter(e.mapOptions.center),e.map.setZoom(e.mapOptions.zoom)},1e3))):console.error("Unable to show route. Status: ".concat(o),t)})}},created:function(){this.settings=HomePortal.getModuleSettings("traffic"),console.log("Module settings",this.settings)},mounted:function(){var e=this;return this.loadGoogleMaps().then(function(){e.createMap(),e.settings.routeToWork&&e.settings.routeToWork.enabled&&e.calcRouteToWork()})}};exports.default=o;
(function(){var t,s=exports.default||module.exports;"function"==typeof s&&(s=s.options),Object.assign(s,((t=function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"page"},[a("div",{staticClass:"overlay"}),t._v(" "),a("div",{staticClass:"wrapper"},[a("div",{staticClass:"page-header"},[t._m(0),t._v(" "),a("div",{staticClass:"back-button",on:{click:function(s){return t.broker.call("$router.goHome")}}})]),t._v(" "),a("div",{staticClass:"page-content"},[a("div",{staticClass:"map"}),t._v(" "),a("div",{staticClass:"infobox"},[a("div",{staticClass:"row"},[a("div",{staticClass:"title"},[t._v("Time")]),t._v(" "),a("div",{staticClass:"value"},[t._v(t._s(t.time))])]),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"title"},[t._v("Distance")]),t._v(" "),a("div",{staticClass:"value"},[t._v(t._s(t.distance))])])])])])])})._withStripped=!0,{render:t,staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"title"},[s("span",[this._v("Traffic map")])])}],_compiled:!0,_scopeId:"data-v-26cce7",functional:void 0}));})();
},{"./images\\background.jpg":[["background.565aafb9.jpg","../../traffic/frontend/images/background.jpg"],"../../traffic/frontend/images/background.jpg"]}],"index.js":[function(require,module,exports) {
"use strict";var e=r(require("./TrafficPage.vue"));function r(e){return e&&e.__esModule?e:{default:e}}var a=HomePortal.dependencies.vue;HomePortal.registerPage({name:"traffic",module:"traffic",showInQuickLaunch:!0,caption:"Traffic Map",icon:"fa fa-globe-americas",mountDiv:function(r){return new a({render:function(r){return r(e.default)}}).$mount(r).$el}});
},{"./TrafficPage.vue":"../../traffic/frontend/TrafficPage.vue"}]},{},["index.js"], null)
//# sourceMappingURL=index.js.map