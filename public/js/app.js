(function(e){function t(t){for(var n,r,i=t[0],c=t[1],d=t[2],u=0,f=[];u<i.length;u++)r=i[u],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&f.push(o[r][0]),o[r]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);l&&l(t);while(f.length)f.shift()();return a.push.apply(a,d||[]),s()}function s(){for(var e,t=0;t<a.length;t++){for(var s=a[t],n=!0,i=1;i<s.length;i++){var c=s[i];0!==o[c]&&(n=!1)}n&&(a.splice(t--,1),e=r(r.s=s[0]))}return e}var n={},o={app:0},a=[];function r(t){if(n[t])return n[t].exports;var s=n[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=e,r.c=n,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(s,n,function(t){return e[t]}.bind(null,n));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var d=0;d<i.length;d++)t(i[d]);var l=c;a.push([0,"chunk-vendors"]),s()})({0:function(e,t,s){e.exports=s("56d7")},"0520":function(e,t){function s(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}s.keys=function(){return[]},s.resolve=s,e.exports=s,s.id="0520"},1:function(e,t){},10:function(e,t){},11:function(e,t){},12:function(e,t){},13:function(e,t){},14:function(e,t){},15:function(e,t){},16:function(e,t){},2:function(e,t){},3:function(e,t){},4:function(e,t){},4678:function(e,t,s){var n={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn-bd":"9686","./bn-bd.js":"9686","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-in":"ec2e","./en-in.js":"ec2e","./en-nz":"6f50","./en-nz.js":"6f50","./en-sg":"b7e9","./en-sg.js":"b7e9","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-mx":"b5b7","./es-mx.js":"b5b7","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fil":"d69a","./fil.js":"d69a","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-deva":"aaf2","./gom-deva.js":"aaf2","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./oc-lnc":"167b","./oc-lnc.js":"167b","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tk":"5aff","./tk.js":"5aff","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-mo":"3a6c","./zh-mo.js":"3a6c","./zh-tw":"90ea","./zh-tw.js":"90ea"};function o(e){var t=a(e);return s(t)}function a(e){if(!s.o(n,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return n[e]}o.keys=function(){return Object.keys(n)},o.resolve=a,e.exports=o,o.id="4678"},"4b4f":function(e,t,s){},"4e5d":function(e,t,s){"use strict";var n=s("4b4f"),o=s.n(n);o.a},5:function(e,t){},"56d7":function(e,t,s){"use strict";s.r(t);var n=s("2b0e"),o=s("7f22"),a=s("8055"),r=s.n(a);const i=o["Transporters"].Base;class c extends i{constructor(e){super(e),this.opts||(this.opts={port:3300}),this.socket=null}async connect(){const e=window.location,t=`${e.protocol.replace("http","ws")}//${e.hostname}:${this.opts.port}/`;this.logger.info(`Connecting to '${t}'...`),this.socket=r()(t),this.socket.on("connect",()=>{this.logger.info("Websocket client connected."),this.onConnected()}),this.socket.on("disconnect",()=>{this.logger.info("Websocket client disconnected")}),this.socket.on("reconnect",()=>{this.logger.info("Websocket client reconnected.")})}async disconnect(){this.socket&&this.socket.close()}arrayBufferToString(e){return new TextDecoder("utf-8").decode(new Uint8Array(e))}async subscribe(e,t){const s=this.getTopicName(e,t);this.socket.hasListeners(s)||this.socket.on(s,t=>{const s=this.arrayBufferToString(t);this.receive(e,s)})}async send(e,t){this.socket.emit(e,t)}}var d=c,l=s("8a77");function u(){const e=window.location.hostname;return"localhost"==e||"127.0.0.1"==e}function f(){const e=new o["ServiceBroker"]({nodeID:"frontend-"+Object(l["a"])(8),transporter:new d,metadata:{local:u()},metrics:{enabled:!1,reporter:"Console"},tracing:{enabled:!1,exporter:"Console"}});return e}function h(e){const t=s("e4c8");t.keys().forEach(s=>{const n=t(s).default;e.createService(n)})}function b(e){const t={};let s;const n=async function(){let s=!1;if(this.$options.events){const n=this.$options.events;Object.keys(n).forEach(o=>{let a=n[o].bind(this);t[o]||(t[o]=[]),e.logger.debug(`Add event listener for '${o}'`),t[o].push(a),n[o].__binded=a,s=!0})}s&&await a()},o=async function(){let s=!1;if(this.$options.events){const n=this.$options.events;Object.keys(n).forEach(o=>{t[o]&&(e.logger.debug(`Remove event listener for '${o}'`),t[o]=t[o].filter(e=>e!=n[o].__binded),s=!0)})}s&&await a()},a=async()=>{const n=e.getLocalService("$event-linker");n&&await e.destroyService(n);const o={name:"$event-linker",events:{}};Object.entries(t).forEach(([e,t])=>{o.events[e]={context:!0,handler(e){t.forEach(t=>t.call(null,e))}}}),s=e.createService(o)};return{addListeners:n,removeListeners:o,reloadService:a,service:s}}var m={install(e){const t=f();e.prototype.broker=t,window.broker=t,window.addEventListener("unload",()=>t.stop()),h(t);const s=b(t);e.mixin({created:s.addListeners,beforeDestroy:s.removeListeners})},get broker(){return window.broker}},g=s("2ef0"),j=s.n(g),v=s("c1df"),p=s.n(v),w=s("cffa"),y=s("ab5b"),k=s.n(y),S=s("8bc8"),T=s.n(S);p.a.locale(window.navigator.userLanguage||window.navigator.language);class P{constructor(){this.settings={},this.modules={},this.pages={},this.widgets={},this.dependencies={vue:n["a"],lodash:j.a,moment:p.a,gsap:w["a"],react:k.a,reactDOM:T.a},this.activePage=null}async init(){this.broker=window.broker;const e=this;this.broker.createService({name:"$router",actions:{goTo(t){t.params.page&&e.goToPage(t.params.page)},goHome(t){e.goHome()}}}),this.updateBootStatus("Starting"),await this.broker.start(),this.updateBootStatus("Load configuration"),await this.downloadConfig(),this.updateBootStatus("Loading modules"),await this.loadModules(),this.updateBootStatus("All modules loaded"),this.goHome(),this.restartScreenSaverTimer(),document.addEventListener("click",()=>this.restartIdleTimer()),document.addEventListener("touch",()=>this.restartIdleTimer())}async updateBootStatus(e){await this.broker.emit("boot.status",{status:e})}async startBroker(){this.updateBootStatus("Starting"),await this.broker.start()}async downloadConfig(){await this.broker.waitForServices("config"),this.settings=await this.broker.call("config.get"),console.log("Full settings",this.settings)}async loadModules(){await this.broker.waitForServices("modules");const e=await this.broker.call("modules.all"),t=Object.keys(this.settings.modules)||[];for(const s of t)await this.registerModule(e[s]);console.log("Modules",this.modules)}async registerModule(e){try{console.log("Register module:",e.name),this.modules[e.name]=e,e.settings=j.a.defaultsDeep({},this.settings.modules[e.name],e.config.defaultSettings),await this.broker.emit("boot.status",{status:`Loading '${e.name}' module`});const t=e.config&&e.config.frontend?e.config.frontend.files:null;if(t&&t.length>0)for(const s of t)s.endsWith(".css")?await this.loadStyleFile(`/modules/${e.name}/${s}`):s.endsWith(".js")?await this.loadScriptFile(`/modules/${e.name}/${s}`):console.log("Unknown file format:",s)}catch(t){console.error("Unable to load module",t,e)}}async loadStyleFile(e){await new Promise((t,s)=>{const n=document.createElement("link");n.href=e,n.type="text/css",n.rel="stylesheet",n.onload=t,n.onerror=s,document.querySelector("head").appendChild(n)})}async loadScriptFile(e){await new Promise((t,s)=>{const n=document.createElement("script");n.onload=t,n.onerror=s,n.src=e,document.querySelector("body").appendChild(n)})}getModule(e){return this.modules[e]}getPage(e){return this.pages[e]}getPages(){return Object.values(this.pages)}getModuleSettings(e){const t=this.getModule(e);if(!t)throw new Error(`Module '${e}' not found.`);return t.settings}registerPage(e){const t=this.getModule(e.module);if(!t)throw new Error(`Module '${e.module}' not found.`);const s={...e};return s.module=t,this.pages[s.name]=s,console.log(`Page '${s.name}' registered.`,s),s}registerWidget(e){this.widgets[e.name]=e,console.log(`Widget '${e.name}' registered.`,e)}getWidget(e){return this.widgets[e]}createService(e){return this.broker.createService(e)}goHome(){var e;const t=null===(e=this.settings.homePage)||void 0===e?void 0:e.page;if(!t)return console.warn("Homepage is not defined.");this.goToPage(t)}async goToPage(e,t){var s;const n=this.getPage(e);if(!n)throw new Error(`Page '${e}' not found.`);if(this.activePage&&this.activePage.name==e)return;const o=document.querySelector("#modules");if(this.activePage&&(this.activePage.content&&(this.animationEnabled()?await w["a"].to(this.activePage.content,{x:"+100vw",duration:.5,display:"none",ease:"Power3.easeIn"}):this.activePage.content.style.display="none",this.activePage.content.classList.remove("active"),o.removeChild(this.activePage.content)),await this.broker.broadcast(`page-${this.activePage.name}.deactivated`)),!n.content)if(j.a.isFunction(n.mountDiv)){const e=document.createElement("div");o.appendChild(e),n.content=n.mountDiv(e)}else j.a.isFunction(n.mount)?n.content=n.mount(o):console.warn(`No 'mount' or 'mountDiv' method in page '${n.name}'`,n);n.content?(o.appendChild(n.content),this.animationEnabled()?await w["a"].fromTo(n.content,{x:"-100vw"},{x:0,duration:.5,display:"block",ease:"Power3.easeOut"}):n.content.style.display="block",n.content.classList.add("active"),await this.broker.broadcast(`page-${n.name}.activated`),this.activePage=n):console.warn(`No content of the '${n.name}' page.`,n);const a=null===(s=this.settings.homePage)||void 0===s?void 0:s.page;e!=a&&this.restartIdleTimer()}animationEnabled(){return!!this.settings.animation}restartScreenSaverTimer(){var e;if(null===(e=this.settings.screenSaver)||void 0===e?void 0:e.enabled){var t;const e=null===(t=this.settings.screenSaver)||void 0===t?void 0:t.time;e>0&&(console.log("Restart screen saver timer...",e),this.screenSaverTimer&&clearTimeout(this.screenSaverTimer),this.screenSaverTimer=setTimeout(()=>{clearTimeout(this.screenSaverTimer),this.screenSaverTimer=null,this.startScreenSaver()},1e3*e))}}startScreenSaver(){var e;const t=null===(e=this.settings.screenSaver)||void 0===e?void 0:e.page;t&&this.goToPage(t,!0)}restartIdleTimer(){var e;const t=null===(e=this.settings.homePage)||void 0===e?void 0:e.idleTime;t>0&&(console.log("Restart ide timer...",t),this.idleTimer&&clearTimeout(this.idleTimer),this.idleTimer=setTimeout(()=>{clearTimeout(this.idleTimer),this.idleTimer=null,this.idleTimeTick()},1e3*t)),this.restartScreenSaverTimer()}idleTimeTick(){this.activePage&&!this.activePage.persistent&&this.goHome()}}window.HomePortal=new P;window.HomePortal,s("15f5"),s("a1a3");var $=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"app"}},[s("div",{attrs:{id:"modules"}}),e.ready?e._e():s("boot-screen",{ref:"bootScreen"})],1)},O=[],_=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"page",attrs:{"data-page":"boot"}},[s("div",{staticClass:"content"},[s("boot-spinner"),s("div",{staticClass:"labels"},[s("div",{staticClass:"title"},[e._v("Home Portal")]),e.error?s("div",{staticClass:"status error"},[s("span",[e._v(e._s(e.error))])]):s("div",{staticClass:"status"},[s("span",[e._v(e._s(e.status)+"...")]),s("div",{staticClass:"cursor"})])])],1)])},E=[],x=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},C=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"loader"},[s("div",{staticClass:"inner one"}),s("div",{staticClass:"inner two"}),s("div",{staticClass:"inner three"})])}],z=(s("f0eb"),s("2877")),M={},B=Object(z["a"])(M,x,C,!1,null,"08e98f6a",null),L=B.exports,D={name:"BootScreen",components:{BootSpinner:L},data(){return{status:"Booting...",error:null}},methods:{updateStatus(e,t){t?this.error=e:this.status=e}}},F=D,H=(s("4e5d"),Object(z["a"])(F,_,E,!1,null,"89c4411e",null)),N=H.exports,U={components:{BootScreen:N},data(){return{ready:!1}},events:{"boot.status"(e){e.params.status&&this.updateBootStatus(String(e.params.status).trim())}},methods:{updateBootStatus(e,t){this.$refs.bootScreen&&this.$refs.bootScreen.updateStatus(e,t)}},async mounted(){try{await window.HomePortal.init(),this.ready=!0}catch(e){this.updateBootStatus("Error: "+e.message,!0)}}},W=U,I=Object(z["a"])(W,$,O,!1,null,null,null),q=I.exports;n["a"].use(m),n["a"].config.productionTip=!1,new n["a"]({render:e=>e(q)}).$mount("#app")},6:function(e,t){},7:function(e,t){},8:function(e,t){},9:function(e,t){},"90a7":function(e,t,s){},a1a3:function(e,t,s){},e4c8:function(e,t){function s(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}s.keys=function(){return[]},s.resolve=s,e.exports=s,s.id="e4c8"},f0eb:function(e,t,s){"use strict";var n=s("90a7"),o=s.n(n);o.a}});