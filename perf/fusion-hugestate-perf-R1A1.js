#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var NanoFlux = require('../dist/nanoflux-fusion.min');
var HugeStatePerfTest = require('../perf/fusion-hugestate-desc')();

NanoFlux.createFusionator({
	action1 : function(state, args){
		// Note: Initially, I generated the state and referenced it, BUT...
		// referencing the variable here has a *huge* performance impact
		return {
			0 : { a : "Value 0", rec : {} }
		};
	},
	action2 : function(state, args){
		return {
			0 : { a : "Value 0", rec : {} }
		};
	}
});

module.exports = PerfTest.createPerfTest('nanoflux-fusion-perf-hugestate-R1A1', HugeStatePerfTest );

