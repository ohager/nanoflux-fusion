var nanoflux = require('nanoflux');

var FUSION_STORE_NAME = "__fusionStore__";

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


	var stateHolder = {
		immutableState : {},
		setState : function(newState){
			deepFreeze(newState);
			this.immutableState = newState;
		}
	};

	function fuseState(newState){
		var state = {};
		Object.assign(state, stateHolder.immutableState, newState);
		stateHolder.setState(state);
		this.notify(stateHolder.immutableState);
	}

	return {
		on__fuse : function(args){

			var fusionator = args.fuse.call(null, stateHolder.immutableState, args.params);
			if(fusionator.then){ // is promise
				fusionator.then(fuseState.bind(this));
			}else{
				fuseState.call(this, fusionator);
			}

		},
		getState : function(){
			return stateHolder.immutableState;
		}
	}
}


function createFusionStore(){
	var store = nanoflux.createStore(FUSION_STORE_NAME, getFusionStoreDefinition());
	nanoflux.createDispatcher(null, ['__fuse']).connectTo(store);
}

// extend nanoflux interface
var fusionators = [];
nanoflux.getFusionStore = function(){ return nanoflux.getStore(FUSION_STORE_NAME) };

nanoflux.createFusionator = function(descriptor){
	var ix = fusionators.length;
	fusionators.push(descriptor);
	return ix;
};

nanoflux.createFusionActor = function(actorId, fusionatorIndex){

	fusionatorIndex =  fusionatorIndex || 0;

	if(fusionatorIndex >= fusionators.length)  throw "Invalid fusionator handler/index";

	var fusionator = fusionators[fusionatorIndex];

	if(!fusionator[actorId]) throw "No fusionator with name '" + actorId + "' registered";

	return function(){
		nanoflux.getDispatcher().__fuse({
			fuse: fusionator[actorId],
			params: arguments
		})
	}
};

// override for tests
var baseReset = nanoflux.reset;
nanoflux.reset = function(){
	baseReset();
	createFusionStore();
	fusionators = [];
};

createFusionStore();

module.exports = nanoflux;
