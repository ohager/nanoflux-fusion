var PerfRunner = require('../perf/perfrunner');
var fusionPerf = require('../perf/fusion-perf');

var tests = [ fusionPerf ];

new PerfRunner().startBenchmark( tests );


