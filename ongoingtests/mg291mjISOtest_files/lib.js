!function(){"use strict";function e(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function t(e,t){return e(t={exports:{}},t.exports),t.exports}var n=t((function(e){function t(n){return e.exports=t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e.exports.__esModule=!0,e.exports.default=e.exports,t(n)}e.exports=t,e.exports.__esModule=!0,e.exports.default=e.exports})),r=e(n),o=e(t((function(e){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},e.exports.__esModule=!0,e.exports.default=e.exports}))),u=t((function(e){var t=n.default;e.exports=function(e,n){if("object"!==t(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,n||"default");if("object"!==t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(e)},e.exports.__esModule=!0,e.exports.default=e.exports}));e(u);var i=t((function(e){var t=n.default;e.exports=function(e){var n=u(e,"string");return"symbol"===t(n)?n:String(n)},e.exports.__esModule=!0,e.exports.default=e.exports}));e(i);var s=e(t((function(e){function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,i(r.key),r)}}e.exports=function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e},e.exports.__esModule=!0,e.exports.default=e.exports})));let a;const c=new Uint8Array(16);function f(){if(!a&&(a="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!a))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return a(c)}var l=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;const p=[];for(let P=0;P<256;++P)p.push((P+256).toString(16).slice(1));function d(e,t=0){return(p[e[t+0]]+p[e[t+1]]+p[e[t+2]]+p[e[t+3]]+"-"+p[e[t+4]]+p[e[t+5]]+"-"+p[e[t+6]]+p[e[t+7]]+"-"+p[e[t+8]]+p[e[t+9]]+"-"+p[e[t+10]]+p[e[t+11]]+p[e[t+12]]+p[e[t+13]]+p[e[t+14]]+p[e[t+15]]).toLowerCase()}function y(e){if(!function(e){return"string"==typeof e&&l.test(e)}(e))throw TypeError("Invalid UUID");let t;const n=new Uint8Array(16);return n[0]=(t=parseInt(e.slice(0,8),16))>>>24,n[1]=t>>>16&255,n[2]=t>>>8&255,n[3]=255&t,n[4]=(t=parseInt(e.slice(9,13),16))>>>8,n[5]=255&t,n[6]=(t=parseInt(e.slice(14,18),16))>>>8,n[7]=255&t,n[8]=(t=parseInt(e.slice(19,23),16))>>>8,n[9]=255&t,n[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,n[11]=t/4294967296&255,n[12]=t>>>24&255,n[13]=t>>>16&255,n[14]=t>>>8&255,n[15]=255&t,n}function h(e,t,n){function r(e,r,o,u){var i;if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));const t=[];for(let n=0;n<e.length;++n)t.push(e.charCodeAt(n));return t}(e)),"string"==typeof r&&(r=y(r)),16!==(null===(i=r)||void 0===i?void 0:i.length))throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let s=new Uint8Array(16+e.length);if(s.set(r),s.set(e,r.length),s=n(s),s[6]=15&s[6]|t,s[8]=63&s[8]|128,o){u=u||0;for(let e=0;e<16;++e)o[u+e]=s[e];return o}return d(s)}try{r.name=e}catch(o){}return r.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",r.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",r}function g(e){return 14+(e+64>>>9<<4)+1}function b(e,t){const n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function m(e,t,n,r,o,u){return b((i=b(b(t,e),b(r,u)))<<(s=o)|i>>>32-s,n);var i,s}function v(e,t,n,r,o,u,i){return m(t&n|~t&r,e,t,o,u,i)}function w(e,t,n,r,o,u,i){return m(t&r|n&~r,e,t,o,u,i)}function U(e,t,n,r,o,u,i){return m(t^n^r,e,t,o,u,i)}function A(e,t,n,r,o,u,i){return m(n^(t|~r),e,t,o,u,i)}h("v3",48,(function(e){if("string"==typeof e){const t=unescape(encodeURIComponent(e));e=new Uint8Array(t.length);for(let n=0;n<t.length;++n)e[n]=t.charCodeAt(n)}return function(e){const t=[],n=32*e.length,r="0123456789abcdef";for(let o=0;o<n;o+=8){const n=e[o>>5]>>>o%32&255,u=parseInt(r.charAt(n>>>4&15)+r.charAt(15&n),16);t.push(u)}return t}(function(e,t){e[t>>5]|=128<<t%32,e[g(t)-1]=t;let n=1732584193,r=-271733879,o=-1732584194,u=271733878;for(let i=0;i<e.length;i+=16){const t=n,s=r,a=o,c=u;n=v(n,r,o,u,e[i],7,-680876936),u=v(u,n,r,o,e[i+1],12,-389564586),o=v(o,u,n,r,e[i+2],17,606105819),r=v(r,o,u,n,e[i+3],22,-1044525330),n=v(n,r,o,u,e[i+4],7,-176418897),u=v(u,n,r,o,e[i+5],12,1200080426),o=v(o,u,n,r,e[i+6],17,-1473231341),r=v(r,o,u,n,e[i+7],22,-45705983),n=v(n,r,o,u,e[i+8],7,1770035416),u=v(u,n,r,o,e[i+9],12,-1958414417),o=v(o,u,n,r,e[i+10],17,-42063),r=v(r,o,u,n,e[i+11],22,-1990404162),n=v(n,r,o,u,e[i+12],7,1804603682),u=v(u,n,r,o,e[i+13],12,-40341101),o=v(o,u,n,r,e[i+14],17,-1502002290),r=v(r,o,u,n,e[i+15],22,1236535329),n=w(n,r,o,u,e[i+1],5,-165796510),u=w(u,n,r,o,e[i+6],9,-1069501632),o=w(o,u,n,r,e[i+11],14,643717713),r=w(r,o,u,n,e[i],20,-373897302),n=w(n,r,o,u,e[i+5],5,-701558691),u=w(u,n,r,o,e[i+10],9,38016083),o=w(o,u,n,r,e[i+15],14,-660478335),r=w(r,o,u,n,e[i+4],20,-405537848),n=w(n,r,o,u,e[i+9],5,568446438),u=w(u,n,r,o,e[i+14],9,-1019803690),o=w(o,u,n,r,e[i+3],14,-187363961),r=w(r,o,u,n,e[i+8],20,1163531501),n=w(n,r,o,u,e[i+13],5,-1444681467),u=w(u,n,r,o,e[i+2],9,-51403784),o=w(o,u,n,r,e[i+7],14,1735328473),r=w(r,o,u,n,e[i+12],20,-1926607734),n=U(n,r,o,u,e[i+5],4,-378558),u=U(u,n,r,o,e[i+8],11,-2022574463),o=U(o,u,n,r,e[i+11],16,1839030562),r=U(r,o,u,n,e[i+14],23,-35309556),n=U(n,r,o,u,e[i+1],4,-1530992060),u=U(u,n,r,o,e[i+4],11,1272893353),o=U(o,u,n,r,e[i+7],16,-155497632),r=U(r,o,u,n,e[i+10],23,-1094730640),n=U(n,r,o,u,e[i+13],4,681279174),u=U(u,n,r,o,e[i],11,-358537222),o=U(o,u,n,r,e[i+3],16,-722521979),r=U(r,o,u,n,e[i+6],23,76029189),n=U(n,r,o,u,e[i+9],4,-640364487),u=U(u,n,r,o,e[i+12],11,-421815835),o=U(o,u,n,r,e[i+15],16,530742520),r=U(r,o,u,n,e[i+2],23,-995338651),n=A(n,r,o,u,e[i],6,-198630844),u=A(u,n,r,o,e[i+7],10,1126891415),o=A(o,u,n,r,e[i+14],15,-1416354905),r=A(r,o,u,n,e[i+5],21,-57434055),n=A(n,r,o,u,e[i+12],6,1700485571),u=A(u,n,r,o,e[i+3],10,-1894986606),o=A(o,u,n,r,e[i+10],15,-1051523),r=A(r,o,u,n,e[i+1],21,-2054922799),n=A(n,r,o,u,e[i+8],6,1873313359),u=A(u,n,r,o,e[i+15],10,-30611744),o=A(o,u,n,r,e[i+6],15,-1560198380),r=A(r,o,u,n,e[i+13],21,1309151649),n=A(n,r,o,u,e[i+4],6,-145523070),u=A(u,n,r,o,e[i+11],10,-1120210379),o=A(o,u,n,r,e[i+2],15,718787259),r=A(r,o,u,n,e[i+9],21,-343485551),n=b(n,t),r=b(r,s),o=b(o,a),u=b(u,c)}return[n,r,o,u]}(function(e){if(0===e.length)return[];const t=8*e.length,n=new Uint32Array(g(t));for(let r=0;r<t;r+=8)n[r>>5]|=(255&e[r/8])<<r%32;return n}(e),8*e.length))}));var _={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function x(e,t,n){if(_.randomUUID&&!t&&!e)return _.randomUUID();const r=(e=e||{}).random||(e.rng||f)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,t){n=n||0;for(let e=0;e<16;++e)t[n+e]=r[e];return t}return d(r)}function I(e,t,n,r){switch(e){case 0:return t&n^~t&r;case 1:case 3:return t^n^r;case 2:return t&n^t&r^n&r}}function S(e,t){return e<<t|e>>>32-t}h("v5",80,(function(e){const t=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){const t=unescape(encodeURIComponent(e));e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n))}else Array.isArray(e)||(e=Array.prototype.slice.call(e));e.push(128);const r=e.length/4+2,o=Math.ceil(r/16),u=new Array(o);for(let i=0;i<o;++i){const t=new Uint32Array(16);for(let n=0;n<16;++n)t[n]=e[64*i+4*n]<<24|e[64*i+4*n+1]<<16|e[64*i+4*n+2]<<8|e[64*i+4*n+3];u[i]=t}u[o-1][14]=8*(e.length-1)/Math.pow(2,32),u[o-1][14]=Math.floor(u[o-1][14]),u[o-1][15]=8*(e.length-1)&4294967295;for(let i=0;i<o;++i){const e=new Uint32Array(80);for(let t=0;t<16;++t)e[t]=u[i][t];for(let t=16;t<80;++t)e[t]=S(e[t-3]^e[t-8]^e[t-14]^e[t-16],1);let r=n[0],o=n[1],s=n[2],a=n[3],c=n[4];for(let n=0;n<80;++n){const u=Math.floor(n/20),i=S(r,5)+I(u,o,s,a)+c+t[u]+e[n]>>>0;c=a,a=s,s=S(o,30)>>>0,o=r,r=i}n[0]=n[0]+r>>>0,n[1]=n[1]+o>>>0,n[2]=n[2]+s>>>0,n[3]=n[3]+a>>>0,n[4]=n[4]+c>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]})),window.dataLayer=window.dataLayer||[],function(e,t,n,r,o,u,i){e.fbq||(o=e.fbq=function(){o.callMethod?o.callMethod.apply(o,arguments):o.queue.push(arguments)},e._fbq||(e._fbq=o),o.push=o,o.loaded=!0,o.version="2.0",o.queue=[],(u=t.createElement(n)).async=!0,u.src="https://connect.facebook.net/en_US/fbevents.js",(i=t.getElementsByTagName(n)[0]).parentNode.insertBefore(u,i))}(window,document,"script"),fbq("init",AoPS.bd.fbq),AoPS.isProduction&&fbq("track","PageView");var E=function(){function e(){o(this,e),this.eventId=x(),dataLayer.push({eventID:this.eventId})}return s(e,[{key:"regenEventId",value:function(){return this.eventId=x(),dataLayer.push({eventID:this.eventId}),this.eventId}},{key:"getUser",value:function(){if(AoPS.session.logged_in){var e=AoPS.session.user_id;if(Number.isInteger(e)||e>1)return e}}},{key:"sendEvent",value:function(e){if("object"===r(e)&&e){var t=Object.entries(e);if(t.length&&(e.a||e.action)){e.url=location.toString(),e.event_id=this.regenEventId();var n=this.getUser();n&&(e.user=n),t=Object.entries(e);var o=new AbortController,u=setTimeout((function(){o.abort(),AoPS.ErrorUtil.log("E_TIMEOUT","Sending event to endpoint /numbers/ajax timed out!")}),1e4);return fetch("/numbers/ajax",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:t.map((function(e){return"&".concat(encodeURIComponent(e[0]),"=").concat(encodeURIComponent(e[1]))})).join("").substring(1),signal:o.signal}).then((function(e){if(!e.ok)throw new Error("".concat(e.status," ").concat(e.statusText));return e.json()})).then((function(e){if(e.error_code||e.error_msg||!e.response)throw new Error("".concat(e.error_code,": ").concat(e.error_msg,"\n").concat(e.response));return e.response})).catch((function(e){AoPS.ErrorUtil.log("E_FETCH_PARSE_OR_RESPONSE",e)})).finally((function(){return clearTimeout(u)}))}AoPS.ErrorUtil.log("E_BAD_PARAMS","Bad parameters for /numbers/ajax event!")}else AoPS.ErrorUtil.log("E_MISSING_PARAMS","Numbers (CAPI) event is missing parameters!")}}]),e}();AoPS.Numbers=new E}();
//# sourceMappingURL=lib.js.map
