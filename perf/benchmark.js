var PerfRunner = require('../perf/perfrunner');
var fusionPerf = require('../perf/fusion-perf');
var fusionPerfHugeStateR1A1 = require('../perf/fusion-hugestate-perf-R1A1');
var fusionPerfHugeStateR1A10 = require('../perf/fusion-hugestate-perf-R1A10');
var fusionPerfHugeStateR2A10 = require('../perf/fusion-hugestate-perf-R2A10');
var fusionPerfHugeStateRefs = require('../perf/fusion-hugestate-perf-referencedstate');

var tests = [
	fusionPerf,
	fusionPerfHugeStateR1A1,
	fusionPerfHugeStateR1A10,
	fusionPerfHugeStateR2A10
];

new PerfRunner().startBenchmark( tests );


