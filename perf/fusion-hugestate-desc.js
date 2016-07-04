#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var NanoFlux = require('../dist/nanoflux-fusion.min');


function mountHugeState(state, arraySize, recursiveDepth){
	if(recursiveDepth<=0) return;

	for(var i = 0; i < arraySize; ++i ){
		state[i] = { a : "Value " + i, rec : {} };
		mountHugeState(state[i].rec,arraySize, recursiveDepth-1);
	}
}

module.exports = function(hugenessOpts){
return {
		fusionStore : NanoFlux.getFusionStore(),
		hugeState : {},

		before : function(){

			hugenessOpts = hugenessOpts || {arraySize : 1, recursiveDepth: 1};


			var a = hugenessOpts.arraySize;
			var r = hugenessOpts.recursiveDepth;
			console.log("Memory: ", process.memoryUsage());
			console.log("Recursive Depth: " + r + " - Array Size: " + a);
			console.log("Total amount of states: " + Math.pow(a, r) );

			var that = this;
			mountHugeState(that.hugeState, a, r);

			NanoFlux.createFusionator({
				action1 : function(state, args){
					return that.hugeState;
				},
				action2 : function(state, args){
					return that.hugeState;
				}
			});

			this.actor1 = NanoFlux.getFusionActor('action1');
			this.actor2 = NanoFlux.getFusionActor('action2');

			this.fusionStore.subscribe(this, function (state) {
				var localstate = state;
			});
	},

		exec : function(i){
			this.actor1();
			this.actor2();
		},

		after : function(){
			this.hugeState = null; // free
			NanoFlux.reset();
			console.log("GC Call --- started");
			var start = Date.now();
			global.gc();
			console.log("GC Call --- finished. Spent time[ms]:", (Date.now()-start));

		}
	}
};

