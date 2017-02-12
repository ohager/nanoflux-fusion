!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.NanoFlux=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
!function(t){if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.NanoFlux=t()}}(function(){return function t(e,r,n){function i(s,c){if(!r[s]){if(!e[s]){var a="function"==typeof _dereq_&&_dereq_;if(!c&&a)return a(s,!0);if(o)return o(s,!0);throw new Error("Cannot find module '"+s+"'")}var u=r[s]={exports:{}};e[s][0].call(u.exports,function(t){var r=e[s][1][t];return i(r?r:t)},u,u.exports,t,e,r,n)}return r[s].exports}for(var o="function"==typeof _dereq_&&_dereq_,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(t,e,r){"use strict";function n(t,e){this.__dispatcher=t,this.__constructor(e)}n.prototype.__constructor=function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e])},n.prototype.dispatch=function(t,e){this.__dispatcher.dispatch(t,e)};var i={};e.exports={clear:function(){i={}},create:function(t,e,r){if(!t||0===t.length)throw"Empty names are not allowed";return i[t]=new n(e,r),i[t]},getActions:function(t){return i[t]}}},{}],2:[function(t,e,r){"use strict";function n(t){return Array.isArray(t)?t:[t]}function i(t){var e=this;this.__stores=[],this.__handlerMapCache={},this.__isDispatching=!1,this.__middlewares=[];var r=function(t){for(var r=n(t),i=0;i<r.length;++i)e.__registerAction(r[i])},i=function(){t&&r(t)};i()}function o(t,e){return t||(t=c),s[t]||(s[t]=new i(e)),s[t]}i.prototype.__getHandlerName=function(t){var e=this.__handlerMapCache[t];return e||(e="on"+t[0].toUpperCase()+t.substr(1),this.__handlerMapCache[t]=e),e},i.prototype.__callAction=function(){var t=this.__getHandlerName(arguments[0]),e=Array.prototype.slice.call(arguments,1);this.__callMiddleware(t,e);for(var r=0;r<this.__stores.length;++r){var n=this.__stores[r];n[t]&&n[t].apply(n,e)}},i.prototype.__registerAction=function(t){this[t]||(this[t]=this.__callAction.bind(this,t))},i.prototype.__callMiddleware=function(t,e){for(var r=0;r<this.__middlewares.length;++r)this.__middlewares[r].call(null,t,e)},i.prototype.addMiddleware=function(t){this.__middlewares.push(t)},i.prototype.connectTo=function(t){for(var e=n(t),r=0;r<e.length;++r)this.__stores.indexOf(e[r])===-1&&this.__stores.push(e[r])},i.prototype.dispatch=function(t,e){if(this.__isDispatching)throw"DISPATCH WHILE DISPATCHING: Don't trigger any action in your store callbacks!";try{this.__isDispatching=!0,this.__registerAction(t),this[t](e)}catch(r){throw console.error(r),r}finally{this.__isDispatching=!1}};var s={},c="__defDispatcher";e.exports={clear:function(){s={}},create:function(t,e){return o(t,e)},getDispatcher:function(t){return o(t)}}},{}],3:[function(t,e,r){"use strict";var n=t("./store"),i=t("./dispatcher"),o=t("./actioncreator");e.exports={reset:function(){i.clear(),n.clear(),o.clear()},createStore:function(t,e){return n.create(t,e)},createDispatcher:function(t,e){return i.create(t,e)},createActions:function(t,e,r){return o.create(t,e,r)},getDispatcher:function(t){return i.getDispatcher(t)},getStore:function(t){return n.getStore(t)},getActions:function(t){return o.getActions(t)},use:function(t,e){e?e.addMiddleware(t):i.getDispatcher().addMiddleware(t)}}},{"./actioncreator":1,"./dispatcher":2,"./store":4}],4:[function(t,e,r){"use strict";function n(t,e){var r=e,n=t;this.unsubscribe=function(){var t=e.indexOf(n);r.splice(t,1)}}function i(t){this.__constructor(t),this.__subscriptionList=[]}i.prototype.__constructor=function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);this.onInitialize&&this.onInitialize()},i.prototype.subscribe=function(t,e){var r={context:t,func:e};return this.__subscriptionList.push(r),new n(r,this.__subscriptionList)},i.prototype.notify=function(){for(var t=0;t<this.__subscriptionList.length;++t){var e=this.__subscriptionList[t];e.func.apply(e.context,arguments)}};var o={};e.exports={clear:function(){o={}},create:function(t,e){return o[t]=new i(e),o[t]},getStore:function(t){return o[t]}}},{}]},{},[3])(3)});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
module.exports = _dereq_('./dist/nanoflux.min');
},{"./dist/nanoflux.min":1}],3:[function(_dereq_,module,exports){
var nanoflux = _dereq_('nanoflux');
var FUSION_STORE_NAME = "__fusionStore__";
var DEFAULT_FUSIONATOR_NAME = "__defaultFusionator__";

function getFusionStoreDefinition(){

	function deepFreeze(obj) {
		var propNames = Object.getOwnPropertyNames(obj);

		propNames.forEach(function(name) {
			var prop = obj[name];
			if (typeof prop == 'object' && prop !== null)
				deepFreeze(prop);
		});

		return Object.freeze(obj);
	}



	var middleware = [];

	var stateHolder = {
		immutableState : null,
		setState : function(newState){
			deepFreeze(newState);
			this.immutableState = newState;
		}
	};

	function callMiddlewares(newState, actorName){
		var mutableState = newState;
		for(var i = 0; i < middleware.length; ++i){
			mutableState = middleware[i].call(this, mutableState, stateHolder.immutableState, actorName);
		}
		return mutableState;
	}

	function fuseState(actorName, newState, isInitialization){
		var state = {};

		if(!isInitialization)
			newState = callMiddlewares.call(this, newState, actorName);

		Object.assign(state, stateHolder.immutableState, newState);
		stateHolder.setState(state);
		if(!isInitialization)
			this.notify(stateHolder.immutableState);
	}

	return {
		on__fuse : function(args){

			var actorName = args.actor;
			var fusionator = args.fuse.call(null, stateHolder.immutableState, args.params);
			if(fusionator.then){ // is promise
				fusionator.then(fuseState.bind(this, actorName)).catch(function(e) {
					console.error("# Nanoflux-Fusion: Promise Exception\n", e );
				});
			}else{
				fuseState.call(this, actorName,fusionator);
			}

		},
		__initState : function(state){
			fuseState.call(this,"__initState",state,true);
		},
		use: function(fn){
			middleware.push(fn);
		},
		getState : function(){
			return stateHolder.immutableState;
		}
	}
}


function createFusionStore(isReset){
	if(nanoflux.getStore(FUSION_STORE_NAME) && !isReset)
		return;
	var store = nanoflux.createStore(FUSION_STORE_NAME, getFusionStoreDefinition());
	nanoflux.createDispatcher(null, ['__fuse']).connectTo(store);
}

// extend nanoflux interface
var fusionators = [];
nanoflux.getFusionStore = function(){ return nanoflux.getStore(FUSION_STORE_NAME) };

function createFusionActor(descriptor, actorId){
	return function(){
		nanoflux.getDispatcher().__fuse({
			actor: actorId,
			fuse: descriptor[actorId],
			params: arguments
		})
	}
}

nanoflux.createFusionator = function(descriptor, initialState, fusionatorName) {
	var fusionator = {
		descriptor: descriptor,
		actors: {}
	};
	if (!initialState) throw "You must specify an initial state";

	nanoflux.getFusionStore().__initState(initialState);
	fusionators[fusionatorName || DEFAULT_FUSIONATOR_NAME] = fusionator;

	for(funcName in descriptor){
		if(descriptor.hasOwnProperty(funcName)){
			fusionator.actors[funcName] = createFusionActor(descriptor,funcName);
		}
	}
};

nanoflux.getFusionActor = function(actorName, fusionatorName){
	fusionatorName =  fusionatorName || DEFAULT_FUSIONATOR_NAME;
	var fusionator = fusionators[fusionatorName];
	if(!fusionator)  throw "Fusionator with name '" + fusionatorName + "' is not defined";
	var actor = fusionator.actors[actorName];
	if(!actor) throw "Actor with name '" + actorName + "' is not defined for fusionator '" + fusionatorName;
	return actor;
};

// override for tests
var baseReset = nanoflux.reset;
nanoflux.reset = function(){
	baseReset();
	createFusionStore(true);
	fusionators = [];
};

createFusionStore(false);

module.exports = nanoflux;

},{"nanoflux":2}]},{},[3])
(3)
});