parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"../../ui-clock/frontend/widgets/ClockWidget.vue":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=HomePortal.dependencies.moment,e={data:function(){return{timer:null,date:null,time:null}},methods:{update:function(){this.time=t().format("LT"),this.date=t().format("LL")}},created:function(){var t=this;this.update(),this.timer=setInterval(function(){return t.update()},1e4)},beforeDestroy:function(){this.timer&&clearInterval(this.timer)}};exports.default=e;
(function(){var t,e=exports.default||module.exports;"function"==typeof e&&(e=e.options),Object.assign(e,((t=function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"panel h-full flex flex-col rounded-md"},[e("div",{staticClass:"flex-1 text-center overflow-hidden text-r6"},[this._v(this._s(this.time))]),this._v(" "),e("div",{staticClass:"highlighted bottom text-2xl text-center"},[this._v(this._s(this.date))])])})._withStripped=!0,{render:t,staticRenderFns:[],_compiled:!0,_scopeId:null,functional:void 0}));})();
},{}],"../../ui-clock/frontend/ClockPage.vue":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=HomePortal.dependencies.moment,e=HomePortal.dependencies.gsap,r=4,o=1,a=550,i=240,n=150,c=170,u={name:"ClockPage",data:function(){return{timer:null,oldHourArc:0,oldMinArc:0,colorID:0,timeStr:null,weekOfDayStr:null,dateStr:null}},methods:{goHome:function(){HomePortal.goHome()},polarToCartesian:function(t,e,r,o){var a=(o-90)*Math.PI/180;return{x:t+r*Math.cos(a),y:e+r*Math.sin(a)}},describeArc:function(t,e,r,o,a){var i=this.polarToCartesian(t,e,r,a),n=this.polarToCartesian(t,e,r,o),c=a-o<=180?"0":"1";return["M",i.x,i.y,"A",r,r,0,c,0,n.x,n.y].join(" ")},update:function(){var a=t(),i=a.hours()%12,u=a.minutes(),s=(a.seconds(),(60*i+u)/720*360),l=u/60*360;this.colorID=i%r;var d=e.timeline(),m=document.querySelector(".clockArc.hour");if(m){this.animateArc(d,m,this.oldHourArc,s,n,0);var h=document.querySelector(".clockDot.hour");this.animateDot(d,h,this.oldHourArc,s,n,-o);var f=document.querySelector(".clockArc.minute");this.animateArc(d,f,this.oldMinArc,l,c,-.8*o);var p=document.querySelector(".clockDot.minute");this.animateDot(d,p,this.oldMinArc,l,c,-.8*o),this.oldHourArc=s,this.oldMinArc=l}this.timeStr=a.format("H:mm"),this.weekOfDayStr=a.format("dddd"),this.dateStr=a.format("MMMM D")},animateArc:function(t,e,r,n,c,u){var s=this,l={arc:r};t.to(l,o,{arc:n,onUpdate:function(){return e.setAttribute("d",s.describeArc(a,i,c,0,l.arc))},ease:"power2.inOut",delay:u})},animateDot:function(t,e,r,n,c,u){var s=this,l={arc:r};t.to(l,o,{arc:n,onUpdate:function(){var t=s.polarToCartesian(a,i,c,l.arc);e.setAttribute("cx",t.x),e.setAttribute("cy",t.y)},ease:"power2.inOut",delay:u})}},mounted:function(){var t=this;this.update(),this.timer=setInterval(function(){return t.update()},5e3)},beforeDestroy:function(){this.timer&&clearInterval(this.timer)},events:{"page-clock.activated":function(){this.update()}}};exports.default=u;
(function(){var t,e=exports.default||module.exports;"function"==typeof e&&(e=e.options),Object.assign(e,((t=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"page",on:{click:t.goHome}},[r("svg",{class:"color-"+t.colorID,attrs:{viewBox:"0 0 800 480"}},[r("defs",[r("pattern",{attrs:{id:"dotPattern",x:"0",y:"0",width:"10",height:"10",patternUnits:"userSpaceOnUse"}},[r("circle",{staticClass:"bgDot",attrs:{cx:"5",cy:"5",r:"2"}})]),t._v(" "),r("radialGradient",{attrs:{id:"backHoleBelowClock",cx:"50%",cy:"50%",r:"50%",fx:"50%",fy:"50%"}},[r("stop",{staticStyle:{"stop-color":"#000","stop-opacity":".7"},attrs:{offset:"50%"}}),t._v(" "),r("stop",{staticStyle:{"stop-color":"#000","stop-opacity":"0"},attrs:{offset:"100%"}})],1),t._v(" "),r("radialGradient",{attrs:{id:"blackVignette",cx:"50%",cy:"50%",r:"50%",fx:"50%",fy:"50%"}},[r("stop",{staticStyle:{"stop-color":"#000","stop-opacity":"0"},attrs:{offset:"20%"}}),t._v(" "),r("stop",{staticStyle:{"stop-color":"#000","stop-opacity":"1"},attrs:{offset:"60%"}})],1),t._v(" "),r("filter",{attrs:{id:"glow"}},[r("feGaussianBlur",{attrs:{stdDeviation:"2.5",result:"coloredBlur"}}),t._v(" "),r("feMerge",[r("feMergeNode",{attrs:{in:"coloredBlur"}}),t._v(" "),r("feMergeNode",{attrs:{in:"SourceGraphic"}})],1)],1),t._v(" "),r("filter",{attrs:{id:"shadow",x:"-20%",y:"-20%",width:"140%",height:"140%"}},[r("feGaussianBlur",{attrs:{in:"SourceAlpha",stdDeviation:"3",result:"shadow"}}),t._v(" "),r("feOffset",{attrs:{dx:"1",dy:"1"}}),t._v(" "),r("feMerge",[r("feMergeNode"),t._v(" "),r("feMergeNode",{attrs:{in:"SourceGraphic"}})],1)],1)],1),t._v(" "),r("rect",{staticStyle:{stroke:"#000",fill:"url(#dotPattern)"},attrs:{x:"-1000",y:"-1000",width:"2000",height:"2000"}}),t._v(" "),r("ellipse",{attrs:{cx:"550",cy:"240",rx:"300",ry:"300",fill:"url(#backHoleBelowClock)"}}),t._v(" "),r("ellipse",{attrs:{cx:"550",cy:"240",rx:"1200",ry:"1200",fill:"url(#blackVignette)"}}),t._v(" "),r("circle",{staticClass:"clockCircle hour",attrs:{cx:"550",cy:"240",r:"150","stroke-width":"6"}}),t._v(" "),r("path",{staticClass:"clockArc hour",attrs:{filter:"url(#glow)"}}),t._v(" "),r("circle",{staticClass:"clockDot hour",attrs:{r:"8",filter:"url(#glow)",cx:"443.01243262687274",cy:"134.86361035502236"}}),t._v(" "),r("circle",{staticClass:"clockCircle minute",attrs:{cx:"550",cy:"240",r:"170","stroke-width":"3"}}),t._v(" "),r("path",{staticClass:"clockArc minute",attrs:{filter:"url(#glow)"}}),t._v(" "),r("circle",{staticClass:"clockDot minute",attrs:{r:"5",filter:"url(#glow)",cx:"567.769838755501",cy:"409.0687222126064"}}),t._v(" "),r("text",{staticClass:"caption timeText",attrs:{x:"550",y:"240","stroke-width":"0","text-anchor":"middle","alignment-baseline":"middle",filter:"url(#shadow)"}},[t._v(" "+t._s(t.timeStr)+" ")]),t._v(" "),r("text",{staticClass:"caption dayText",attrs:{x:"300",y:"210","stroke-width":"0","text-anchor":"end","alignment-baseline":"middle",filter:"url(#shadow)"}},[t._v(" "+t._s(t.weekOfDayStr)+" ")]),t._v(" "),r("text",{staticClass:"caption dateText",attrs:{x:"300",y:"250","stroke-width":"0","text-anchor":"end","alignment-baseline":"middle",filter:"url(#shadow)"}},[t._v(" "+t._s(t.dateStr)+" ")])])])})._withStripped=!0,{render:t,staticRenderFns:[],_compiled:!0,_scopeId:"data-v-4a0e53",functional:void 0}));})();
},{}],"index.js":[function(require,module,exports) {
"use strict";var e=t(require("./widgets/ClockWidget.vue")),r=t(require("./ClockPage.vue"));function t(e){return e&&e.__esModule?e:{default:e}}var n=HomePortal.dependencies.vue;HomePortal.registerWidget({name:"clock",mountDiv:function(r){return new n({render:function(r){return r(e.default)}}).$mount(r)}}),HomePortal.registerPage({name:"clock",module:"ui-clock",persistent:!0,mountDiv:function(e){return new n({render:function(e){return e(r.default)}}).$mount(e).$el}});
},{"./widgets/ClockWidget.vue":"../../ui-clock/frontend/widgets/ClockWidget.vue","./ClockPage.vue":"../../ui-clock/frontend/ClockPage.vue"}]},{},["index.js"], null)
//# sourceMappingURL=index.js.map