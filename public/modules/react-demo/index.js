parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"../../react-demo/frontend/index.jsx":[function(require,module,exports) {
function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function r(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function u(t){var e=l();return function(){var n,r=a(t);if(e){var o=a(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return i(this,n)}}function i(e,n){return!n||"object"!==t(n)&&"function"!=typeof n?f(e):n}function f(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function l(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var s=HomePortal.dependencies.react,p=HomePortal.dependencies.reactDOM,y=function(t){o(c,s.Component);var n=u(c);function c(t){var r;return e(this,c),(r=n.call(this,t)).state={liked:!1},r}return r(c,[{key:"render",value:function(){var t=this;return this.state.liked?s.createElement("div",null,"You liked this."):s.createElement("button",{onClick:function(){return t.setState({liked:!0})}},"Like")}}]),c}();HomePortal.registerWidget({name:"react-demo",mount:function(t){return p.render(s.createElement("div",{className:"panel",style:{height:"100%"}},s.createElement(y,null)),t)}});
},{}],"../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var e,t,o=arguments[3],a="__parcel__error__overlay__",r=module.bundle.Module;function n(e){r.call(this,e),this.hot={data:module.bundle.hotData,_acceptCallbacks:[],_disposeCallbacks:[],accept:function(e){this._acceptCallbacks.push(e||function(){})},dispose:function(e){this._disposeCallbacks.push(e)}},module.bundle.hotData=null}module.bundle.Module=n;var c=module.bundle.parent;if(!(c&&c.isParcelRequire||"undefined"==typeof WebSocket)){var i=location.hostname,l="https:"===location.protocol?"wss":"ws",s=new WebSocket(l+"://"+i+":64946/");s.onmessage=function(a){e={},t=[];var r=JSON.parse(a.data);if("update"===r.type){var n=!1;r.assets.forEach(function(e){e.isNew||h(o.parcelRequire,e.id)&&(n=!0)}),(n=n||r.assets.every(function(e){return"css"===e.type&&e.generated.js}))?(console.clear(),r.assets.forEach(function(e){f(o.parcelRequire,e)}),t.forEach(function(e){m(e[0],e[1])})):location.reload&&location.reload()}if("reload"===r.type&&(s.close(),s.onclose=function(){location.reload()}),"error-resolved"===r.type&&(console.log("[parcel] ✨ Error resolved"),p()),"error"===r.type){console.error("[parcel] 🚨  "+r.error.message+"\n"+r.error.stack),p();var c=d(r);document.body.appendChild(c)}}}function p(){var e=document.getElementById(a);e&&e.remove()}function d(e){var t=document.createElement("div");t.id=a;var o=document.createElement("div"),r=document.createElement("pre");return o.innerText=e.error.message,r.innerText=e.error.stack,t.innerHTML='<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;"><span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span><span style="top: 2px; margin-left: 5px; position: relative;">🚨</span><div style="font-size: 18px; font-weight: bold; margin-top: 20px;">'+o.innerHTML+"</div><pre>"+r.innerHTML+"</pre></div>",t}function u(e,t){var o=e.modules;if(!o)return[];var a,r,n,c=[];for(a in o)for(r in o[a][1])((n=o[a][1][r])===t||Array.isArray(n)&&n[n.length-1]===t)&&c.push(a);return e.parent&&(c=c.concat(u(e.parent,t))),c}function f(e,t){var o=e.modules;if(o)if(o[t.id]||!e.parent){var a=new Function("require","module","exports",t.generated.js);t.isNew=!o[t.id],o[t.id]=[a,t.deps]}else e.parent&&f(e.parent,t)}function h(a,r){var n=a.modules;if(n){if(!n[r]&&a.parent)return h(a.parent,r);if(!e[r]){e[r]=!0;var c=a.cache[r];return t.push([a,r]),!!(c&&c.hot&&c.hot._acceptCallbacks.length)||u(o.parcelRequire,r).some(function(e){return h(o.parcelRequire,e)})}}}function m(e,t){var o=e.cache[t];if(e.hotData={},o&&(o.hot.data=e.hotData),o&&o.hot&&o.hot._disposeCallbacks.length&&o.hot._disposeCallbacks.forEach(function(t){t(e.hotData)}),delete e.cache[t],e(t),(o=e.cache[t])&&o.hot&&o.hot._acceptCallbacks.length)return o.hot._acceptCallbacks.forEach(function(e){e()}),!0}
},{}]},{},["../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../../react-demo/frontend/index.jsx"], null)
//# sourceMappingURL=index.js.map