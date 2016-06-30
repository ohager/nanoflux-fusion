var PerfRunner = require('../perf/perfrunner');
var fusionPerf = require('../perf/fusion-perf');
// TODO: test for huge state!
//var fusionPerfHugeState = require('../perf/fusion-perf-huge');

new PerfRunner().startBenchmark([
	fusionPerf
]);


