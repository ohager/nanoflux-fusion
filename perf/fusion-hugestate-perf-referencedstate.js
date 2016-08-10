#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var HugeStatePerfTestFunc = require('../perf/fusion-hugestate-desc');

var tests = [];

for(var recSize = 1 ; recSize <= 4; ++recSize ){
	for(var arraySize = 10; arraySize <= 40; arraySize += 10){
		var testname = 'nanoflux-fusion-perf-hugestate-refs-R' + recSize + 'A' + arraySize;
		var test = HugeStatePerfTestFunc({recursiveDepth:recSize, arraySize:arraySize});
		tests.push(PerfTest.createPerfTest(testname, test ))
	}
}

module.exports = tests;