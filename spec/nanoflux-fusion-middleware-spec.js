var nanofluxDir;

// @ifdef DIST
nanofluxDir = "../dist/nanoflux-fusion";
// @endif

// @ifndef DIST
nanofluxDir = "../src/nanoflux-fusion";
// @endif

var NanoFlux = require(nanofluxDir);

function Logger(){
	var logData = [];

	this.log = function(state, args){
		logData.push({
			t: log.length,
			args: args[0],
			a: state.a,
			b: state.b
		});
	};

	this.isEmpty = function(){ return logData.length === 0 };

	this.getLogEntry = function(t){
		return logData[t];
	};
}


describe("NanoFlux Fusion Middleware", function () {

	beforeEach(function () {
		NanoFlux.reset();
	});

	it("should add and execute single middlewares", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var logger = new Logger();
		fusionStore.use( logger.log );

		var subscription = fusionStore.subscribe(this, function (state) {

			expect(logger.isEmpty()).toBeFalsy();

			var entry = logger.getLogEntry(0);
			expect(entry.args).toBe("fromA");
			expect(entry.a).toBe("");
			expect(entry.b).toBe(0);

			entry = logger.getLogEntry(1);
			if(entry)
			{
				expect(entry.args).toBe(42);
				expect(entry.a).toBe("fromA");
				expect(entry.b).toBe(0);
			}

		});

		NanoFlux.createFusionator({
			testA : function(state, args) {
				return {a: args[0]}
			},
			testB : function(state, args){
				return {b: args[0]}
			}
		}, {
			a: "",
			b : 0
		});

		var testActorA = NanoFlux.getFusionActor("testA");
		var testActorB = NanoFlux.getFusionActor("testB");

		testActorA("fromA");
		testActorB(42);

		subscription.unsubscribe();

	});

});
