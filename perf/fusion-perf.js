#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var NanoFlux = require('../dist/nanoflux-fusion.min');

const ACTION_1 = 1;
const ACTION_2 = 2;

function fusionator(state, action) {
	switch(action.id){
		case ACTION_1:
			return {a: action.args[0] };
		case ACTION_2:
			return {b: action.args[0]};
	}
}


module.exports = PerfTest.createPerfTest('nanoflux-fusion-perf', {
	fusionStore : NanoFlux.getFusionStore(),
	actor1 :   NanoFlux.createFusionActor(fusionator, ACTION_1),
	actor2 :   NanoFlux.createFusionActor(fusionator, ACTION_2),

   before : function(){

	   var subscription = this.fusionStore.subscribe(this, function (state) {
		   var localState = state;
	   });

   },

    exec : function(i){
		this.actor1("test 1." + i);
		this.actor2("test 2." + i);
    },

    after : function(){
    }

});

