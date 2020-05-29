function _createForOfIteratorHelper(e,t){var r;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(r=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,i=function(){};return{s:i,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,s=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw a}}}}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function asyncGeneratorStep(e,t,r,n,i,a,o){try{var s=e[a](o),l=s.value}catch(h){return void r(h)}s.done?t(l):Promise.resolve(l).then(n,i)}function _asyncToGenerator(e){return function(){var t=this,r=arguments;return new Promise((function(n,i){var a=e.apply(t,r);function o(e){asyncGeneratorStep(a,n,i,o,s,"next",e)}function s(e){asyncGeneratorStep(a,n,i,o,s,"throw",e)}o(void 0)}))}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[93],{"8Mb5":function(e,t,r){"use strict";r.r(t),r.d(t,"ion_virtual_scroll",(function(){return s}));var n=r("imtE");r("AfW+");var i=function(e,t){var r=a(e,t);return r&&e.ownerDocument?e.ownerDocument.importNode(r.content,!0).children[0]:null},a=function(e,t){switch(t){case"item":return e.querySelector("template:not([name])");case"header":return e.querySelector("template[name=header]");case"footer":return e.querySelector("template[name=footer]")}},o=function(e,t,r,n,i,a,o,s,l,h,c,u){for(var f=[],d=u+c,p=c;p<d;p++){var v=e[p];if(i){var g=i(v,p,e);null!=g&&f.push({i:h++,type:"header",value:g,index:p,height:r?r(g,p):o,reads:r?0:2,visible:!!r})}if(f.push({i:h++,type:"item",value:v,index:p,height:t?t(v,p):l,reads:t?0:2,visible:!!t}),a){var m=a(v,p,e);null!=m&&f.push({i:h++,type:"footer",value:m,index:p,height:n?n(m,p):s,reads:n?0:2,visible:!!n})}}return f},s=function(){function e(t){var r=this;_classCallCheck(this,e),Object(n.k)(this,t),this.range={offset:0,length:0},this.viewportHeight=0,this.cells=[],this.virtualDom=[],this.isEnabled=!1,this.viewportOffset=0,this.currentScrollTop=0,this.indexDirty=0,this.lastItemLen=0,this.totalHeight=0,this.approxItemHeight=45,this.approxHeaderHeight=30,this.approxFooterHeight=30,this.onScroll=function(){r.updateVirtualScroll()}}var t,r,a;return _createClass(e,[{key:"itemsChanged",value:function(){this.calcCells(),this.updateVirtualScroll()}},{key:"connectedCallback",value:(a=_asyncToGenerator(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t=this.el.closest("ion-content"))){e.next=10;break}return e.next=4,t.getScrollElement();case 4:this.scrollEl=e.sent,this.contentEl=t,this.calcCells(),this.updateState(),e.next=11;break;case 10:console.error("<ion-virtual-scroll> must be used inside an <ion-content>");case 11:case"end":return e.stop()}}),e,this)}))),function(){return a.apply(this,arguments)})},{key:"componentDidUpdate",value:function(){this.updateState()}},{key:"disconnectedCallback",value:function(){this.scrollEl=void 0}},{key:"onResize",value:function(){this.calcCells(),this.updateVirtualScroll()}},{key:"positionForItem",value:function(e){return Promise.resolve(function(e,t,r){var n=t.find((function(t){return"item"===t.type&&t.index===e}));return n?r[n.i]:-1}(e,this.cells,this.getHeightIndex()))}},{key:"checkRange",value:(r=_asyncToGenerator(regeneratorRuntime.mark((function e(t){var r,n,i,a,s=arguments;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=s.length>1&&void 0!==s[1]?s[1]:-1,this.items){e.next=3;break}return e.abrupt("return");case 3:n=-1===r?this.items.length-t:r,i=function(e,t){return 0===t?0:t===(e.length>0?e[e.length-1].index:0)+1?e.length:e.findIndex((function(e){return e.index===t}))}(this.cells,t),a=o(this.items,this.itemHeight,this.headerHeight,this.footerHeight,this.headerFn,this.footerFn,this.approxHeaderHeight,this.approxFooterHeight,this.approxItemHeight,i,t,n),this.cells=function(e,t,r){if(0===r&&t.length>=e.length)return t;for(var n=0;n<t.length;n++)e[n+r]=t[n];return e}(this.cells,a,i),this.lastItemLen=this.items.length,this.indexDirty=Math.max(t-1,0),this.scheduleUpdate();case 5:case"end":return e.stop()}}),e,this)}))),function(e){return r.apply(this,arguments)})},{key:"checkEnd",value:(t=_asyncToGenerator(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.items&&this.checkRange(this.lastItemLen);case 1:case"end":return e.stop()}}),e,this)}))),function(){return t.apply(this,arguments)})},{key:"updateVirtualScroll",value:function(){this.isEnabled&&this.scrollEl&&(this.timerUpdate&&(clearTimeout(this.timerUpdate),this.timerUpdate=void 0),Object(n.g)(this.readVS.bind(this)),Object(n.l)(this.writeVS.bind(this)))}},{key:"readVS",value:function(){for(var e=this.contentEl,t=this.scrollEl,r=0,n=this.el;n&&n!==e;)r+=n.offsetTop,n=n.parentElement;this.viewportOffset=r,t&&(this.viewportHeight=t.offsetHeight,this.currentScrollTop=t.scrollTop)}},{key:"writeVS",value:function(){var e,t,r=this.indexDirty,n=(e=this.currentScrollTop-this.viewportOffset,t=this.viewportHeight,{top:Math.max(e-100,0),bottom:e+t+100}),a=this.getHeightIndex(),o=function(e,t,r){for(var n=t.top,i=t.bottom,a=0;a<e.length&&!(e[a]>n);a++);for(var o=Math.max(a-2-1,0);a<e.length&&!(e[a]>=i);a++);return{offset:o,length:Math.min(a+2,e.length)-o}}(a,n);(function(e,t,r){return e<=r.offset+r.length||t.offset!==r.offset||t.length!==r.length})(r,this.range,o)&&(this.range=o,function(e,t,r,n){var i,a=_createForOfIteratorHelper(e);try{for(a.s();!(i=a.n()).done;){var o=i.value;o.change=0,o.d=!0}}catch(v){a.e(v)}finally{a.f()}for(var s=[],l=n.offset+n.length,h=function(n){var i=r[n],a=e.find((function(e){return e.d&&e.cell===i}));if(a){var o=t[n];o!==a.top&&(a.top=o,a.change=1),a.d=!1}else s.push(i)},c=n.offset;c<l;c++)h(c);for(var u=e.filter((function(e){return e.d})),f=function(){var r=p[d],n=u.find((function(e){return e.d&&e.cell.type===r.type})),i=r.i;n?(n.d=!1,n.change=2,n.cell=r,n.top=t[i]):e.push({d:!1,cell:r,visible:!0,change:2,top:t[i]})},d=0,p=s;d<p.length;d++)f();e.filter((function(e){return e.d&&-9999!==e.top})).forEach((function(e){e.change=1,e.top=-9999}))}(this.virtualDom,a,this.cells,o),this.nodeRender?function(e,t,r,n){for(var a,o=Array.from(e.children).filter((function(e){return"TEMPLATE"!==e.tagName})),s=o.length,l=0;l<r.length;l++){var h=r[l],c=h.cell;if(2===h.change){if(l<s)t(a=o[l],c,l);else{var u=i(e,c.type);(a=t(u,c,l)||u).classList.add("virtual-item"),e.appendChild(a)}a.$ionCell=c}else a=o[l];0!==h.change&&(a.style.transform="translate3d(0,".concat(h.top,"px,0)"));var f=c.visible;h.visible!==f&&(f?a.classList.remove("virtual-loading"):a.classList.add("virtual-loading"),h.visible=f),c.reads>0&&(n(c,a),c.reads--)}}(this.el,this.nodeRender,this.virtualDom,this.updateCellHeight.bind(this)):this.domRender?this.domRender(this.virtualDom):this.renderItem&&this.el.forceUpdate())}},{key:"updateCellHeight",value:function(e,t){var r=this,n=function(){if(t.$ionCell===e){var n=window.getComputedStyle(t),i=t.offsetHeight+parseFloat(n.getPropertyValue("margin-bottom"));r.setCellHeight(e,i)}};t&&t.componentOnReady?t.componentOnReady().then(n):n()}},{key:"setCellHeight",value:function(e,t){var r=e.i;e===this.cells[r]&&(e.height===t&&!0===e.visible||(e.visible=!0,e.height=t,this.indexDirty=Math.min(this.indexDirty,r),this.scheduleUpdate()))}},{key:"scheduleUpdate",value:function(){var e=this;clearTimeout(this.timerUpdate),this.timerUpdate=setTimeout((function(){return e.updateVirtualScroll()}),100)}},{key:"updateState",value:function(){var e=!(!this.scrollEl||!this.cells);e!==this.isEnabled&&(this.enableScrollEvents(e),e&&this.updateVirtualScroll())}},{key:"calcCells",value:function(){this.items&&(this.lastItemLen=this.items.length,this.cells=o(this.items,this.itemHeight,this.headerHeight,this.footerHeight,this.headerFn,this.footerFn,this.approxHeaderHeight,this.approxFooterHeight,this.approxItemHeight,0,0,this.lastItemLen),this.indexDirty=0)}},{key:"getHeightIndex",value:function(){return this.indexDirty!==1/0&&this.calcHeightIndex(this.indexDirty),this.heightIndex}},{key:"calcHeightIndex",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;this.heightIndex=function(e,t){if(!e)return new Uint32Array(t);if(e.length===t)return e;if(t>e.length){var r=new Uint32Array(t);return r.set(e),r}return e.subarray(0,t)}(this.heightIndex,this.cells.length),this.totalHeight=function(e,t,r){for(var n=e[r],i=r;i<e.length;i++)e[i]=n,n+=t[i].height;return n}(this.heightIndex,this.cells,e),this.indexDirty=1/0}},{key:"enableScrollEvents",value:function(e){var t=this;this.rmEvent&&(this.rmEvent(),this.rmEvent=void 0);var r=this.scrollEl;r&&(this.isEnabled=e,r.addEventListener("scroll",this.onScroll),this.rmEvent=function(){r.removeEventListener("scroll",t.onScroll)})}},{key:"renderVirtualNode",value:function(e){var t=e.cell,r=t.type,n=t.value,i=t.index;switch(r){case"item":return this.renderItem(n,i);case"header":return this.renderHeader(n,i);case"footer":return this.renderFooter(n,i)}}},{key:"render",value:function(){var e=this;return Object(n.i)(n.a,{style:{height:"".concat(this.totalHeight,"px")}},this.renderItem&&Object(n.i)(l,{dom:this.virtualDom},this.virtualDom.map((function(t){return e.renderVirtualNode(t)}))))}},{key:"el",get:function(){return Object(n.f)(this)}}],[{key:"watchers",get:function(){return{itemHeight:["itemsChanged"],headerHeight:["itemsChanged"],footerHeight:["itemsChanged"],items:["itemsChanged"]}}},{key:"style",get:function(){return"ion-virtual-scroll{display:block;position:relative;width:100%;contain:strict;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}ion-virtual-scroll>.virtual-loading{opacity:0}ion-virtual-scroll>.virtual-item{position:absolute!important;top:0!important;right:0!important;left:0!important;-webkit-transition-duration:0ms;transition-duration:0ms;will-change:transform}"}}]),e}(),l=function(e,t,r){var n=e.dom;return r.map(t,(function(e,t){var r=n[t],i=e.vattrs||{},a=i.class||"";return a+="virtual-item ",r.visible||(a+="virtual-loading"),Object.assign(Object.assign({},e),{vattrs:Object.assign(Object.assign({},i),{class:a,style:Object.assign(Object.assign({},i.style),{transform:"translate3d(0,".concat(r.top,"px,0)")})})})}))}}}]);