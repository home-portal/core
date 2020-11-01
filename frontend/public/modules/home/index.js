parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"../../home/frontend/HomePage.vue":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=HomePortal.dependencies.moment,t=HomePortal.dependencies.gsap,i={computed:{pages:function(){return HomePortal.getPages().filter(function(e){return!!e.showInQuickLaunch})}},data:function(){return{settings:{},timer:null,date:null,time:null}},methods:{update:function(){this.time=e().format("LT"),this.date=e().format("LL")},loadWidgets:function(){var e=this.settings.widgets;if(e&&e.length>0){console.log("Loading widgets...");for(var t=Math.min(e.length,6),i=0;i<t;i++){var o=HomePortal.getWidget(e[i]);if(o){console.log("Loading widget...",o);try{var n=this.$el.querySelector(".widget.w".concat(i+1));if(_.isFunction(o.mountDiv)){var r=document.createElement("div");n.appendChild(r),o.content=o.mountDiv(r)}else _.isFunction(o.mount)?o.content=o.mount(n):console.warn("No 'mount' or 'mountDiv' method in widget '".concat(o.name,"'"),o)}catch(a){console.error("Unable to render widget",a,o)}}}}}},created:function(){var e=this;this.settings=HomePortal.getModuleSettings("home"),console.log("Module settings",this.settings),this.update(),this.timer=setInterval(function(){return e.update()},1e4)},mounted:function(){this.loadWidgets()},events:{"page-home.activated":function(){t.fromTo(this.$el.querySelectorAll(".widgets .widget"),{y:-100,opacity:0},{y:0,opacity:1,delay:.2,duration:1,visibility:"visible",ease:"elastic.out(1, 0.5)",stagger:.15}),t.fromTo(this.$el.querySelector(".footer"),{y:100},{y:0,delay:.5,duration:1.5,visibility:"visible",ease:"elastic.out(1, 0.5)"}),t.fromTo(this.$el.querySelectorAll(".footer .toolbar .item"),{opacity:0,scale:.2},{opacity:1,scale:1,delay:1,duration:1,ease:"elastic.out(1, 0.5)",stagger:.2}),t.fromTo(this.$el.querySelectorAll(".action-bar .btn"),{y:-100},{y:0,delay:1,duration:2,visibility:"visible",ease:"elastic.out(1, 0.5)",stagger:.2})},"page-home.deactivated":function(){t.to(this.$el.querySelectorAll(".widgets .widget"),{visibility:"hidden",duration:.5}),t.to(this.$el.querySelector(".footer"),{visibility:"hidden",duration:.5}),t.to(this.$el.querySelectorAll(".action-bar .btn"),{visibility:"hidden",duration:.5})}},beforeDestroy:function(){this.timer&&clearInterval(this.timer)}};exports.default=i;
(function(){var t,e=exports.default||module.exports;"function"==typeof e&&(e=e.options),Object.assign(e,((t=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"page"},[s("div",{staticClass:"overlay"}),t._v(" "),s("div",{staticClass:"wrapper"},[t._m(0),t._v(" "),t._m(1),t._v(" "),s("div",{staticClass:"footer panel mt-2 flex flex-col justify-center invisible"},[s("div",{staticClass:"toolbar flex justify-around py-3"},t._l(t.pages,function(e){return s("div",{key:e.name,staticClass:"item flex-1 text-4xl text-center cursor-pointer",on:{click:function(s){return t.broker.call("$router.goTo",{page:e.name})}}},[s("i",{staticClass:"text-white rounded-full",class:e.icon||"fa fa-question"}),t._v(" "),s("div",{staticClass:"hidden mt-1 text-base text-center font-normal text-gray-100"},[t._v(t._s(e.caption))])])}),0)])])])})._withStripped=!0,{render:t,staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"page-header"},[e("div",{staticClass:"title"},[e("span",[this._v("Home Portal")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"page-content flex-1 flex flex-col overflow-hidden"},[e("div",{staticClass:"widgets layout-2x2"},[e("div",{staticClass:"widget w1"}),this._v(" "),e("div",{staticClass:"widget w2"}),this._v(" "),e("div",{staticClass:"widget w3"}),this._v(" "),e("div",{staticClass:"widget w4"}),this._v(" "),e("div",{staticClass:"widget w5"}),this._v(" "),e("div",{staticClass:"widget w6"})])])}],_compiled:!0,_scopeId:"data-v-9fd7ba",functional:void 0}));})();
},{"./images\\background.jpg":[["background.565aafb9.jpg","../../home/frontend/images/background.jpg"],"../../home/frontend/images/background.jpg"]}],"../../home/frontend/index.js":[function(require,module,exports) {
"use strict";var e=r(require("./HomePage.vue"));function r(e){return e&&e.__esModule?e:{default:e}}var n=HomePortal.dependencies.vue;HomePortal.registerPage({name:"home",module:"home",mountDiv:function(r){return new n({render:function(r){return r(e.default)}}).$mount(r).$el}});
},{"./HomePage.vue":"../../home/frontend/HomePage.vue"}]},{},["../../home/frontend/index.js"], null)
//# sourceMappingURL=index.js.map