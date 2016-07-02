#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var NanoFlux = require('../dist/nanoflux-fusion.min');

NanoFlux.createFusionator({
	action1 : function(state, args){
		return { a: args[0] };
	},
	action2 : function(state, args){
		return { b: args[0] };
	}
});

module.exports = PerfTest.createPerfTest('nanoflux-fusion-perf', {
	fusionStore : NanoFlux.getFusionStore(),
	actor1 :   NanoFlux.getFusionActor('action1'),
	actor2 :   NanoFlux.getFusionActor('action2'),

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

