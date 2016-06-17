var PerfRunner = require('../perf/perfrunner');
var fusionPerf = require('../perf/fusion-perf');
//var fusionPerfHugeState = require('../perf/fusion-perf-huge');

new PerfRunner().startBenchmark([
	fusionPerf
]);


