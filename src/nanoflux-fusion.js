var nanoflux = require('nanoflux/dist/nanoflux');

function createStore(){

	function deepFreeze(obj) {
		var propNames = Object.getOwnPropertyNames(obj);

		propNames.forEach(function(name) {
			var prop = obj[name];
			if (typeof prop == 'object' && prop !== null)
				deepFreeze(prop);
		});

		return Object.freeze(obj);
	}

	var stateHolder = {
		immutableState : {},
		setState : function(newState){
			deepFreeze(newState);
			this.immutableState = newState;
		}
	};

	return {
		on__fuse : function(args){
			var state = {};

			Object.assign(state, args.fuse.call(null, stateHolder.immutableState, args.action));
			stateHolder.setState(state);

			this.notify(state);
		},
		getState : function(){
			return stateHolder.immutableState;
		}
	}
}

var FUSION_STORE_NAME = "__fusionStore__";

var store = nanoflux.createStore(FUSION_STORE_NAME, createStore());
nanoflux.createDispatcher(null, ['__fuse']).connectTo(store);

// extend nanoflux interface
nanoflux.getFusionStore = function(){ return nanoflux.getStore(FUSION_STORE_NAME) };
nanoflux.createFusionActor = function(fuseFunc, actorId){
	return function(){
		nanoflux.getDispatcher().__fuse({
			fuse: fuseFunc,
			action: {
				id : actorId,
				args : arguments
			}
		})
	}
};

module.exports = nanoflux;
