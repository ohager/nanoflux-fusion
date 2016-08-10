var nanoflux = require('nanoflux');

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


	var stateHolder = {
		immutableState : null,
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


function createFusionStore(isReset){
	if(nanoflux.getStore(FUSION_STORE_NAME) && !isReset)
		return;
	var store = nanoflux.createStore(FUSION_STORE_NAME, getFusionStoreDefinition());
	nanoflux.createDispatcher(null, ['__fuse']).connectTo(store);
}

// extend nanoflux interface
var fusionators = [];
nanoflux.getFusionStore = function(){ return nanoflux.getStore(FUSION_STORE_NAME) };

function createFusionActor(descriptor, actorId, initialState){
	return function(){
		nanoflux.getDispatcher().__fuse({
			fuse: descriptor[actorId],
			params: arguments
		})
	}
}


nanoflux.createFusionator = function(descriptor, fusionatorName, initialState){
	var fusionator = {
		descriptor : descriptor,
		actors : {}
	};
	//fuseState(initialState);
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
