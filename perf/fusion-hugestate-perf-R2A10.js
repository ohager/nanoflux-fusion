#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var NanoFlux = require('../dist/nanoflux-fusion.min');
var HugeStatePerfTest = require('../perf/fusion-hugestate-desc')();

NanoFlux.createFusionator({
	action1 : function(state, args){
		// Note: Initially, I generated the state and referenced it, BUT...
		// referencing the variable here has a *huge* performance impact
		return {
				0 : { a : "Value 0", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				1 : { a : "Value 1", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				2 : { a : "Value 2", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				3 : { a : "Value 3", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				4 : { a : "Value 4", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				5 : { a : "Value 5", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				6 : { a : "Value 6", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				7 : { a : "Value 7", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				8 : { a : "Value 8", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				9 : { a : "Value 9", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} }
			}
		},
	action2 : function(state, args){
		// Note: Initially, I generated the state and referenced it, BUT...
		// referencing the variable here has a *huge* performance impact
		return {
				0 : { a : "Value 0", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				1 : { a : "Value 1", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				2 : { a : "Value 2", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				3 : { a : "Value 3", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				4 : { a : "Value 4", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				5 : { a : "Value 5", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				6 : { a : "Value 6", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				7 : { a : "Value 7", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				8 : { a : "Value 8", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} },
				9 : { a : "Value 9", rec : {
					0 : { a : "Value 0", rec : {} },
					1 : { a : "Value 1", rec : {} },
					2 : { a : "Value 2", rec : {} },
					3 : { a : "Value 3", rec : {} },
					4 : { a : "Value 4", rec : {} },
					5 : { a : "Value 5", rec : {} },
					6 : { a : "Value 6", rec : {} },
					7 : { a : "Value 7", rec : {} },
					8 : { a : "Value 8", rec : {} },
					9 : { a : "Value 9", rec : {} }
				} }
			}
		}
});

module.exports = PerfTest.createPerfTest('nanoflux-fusion-perf-hugestate-R2A10', HugeStatePerfTest );

