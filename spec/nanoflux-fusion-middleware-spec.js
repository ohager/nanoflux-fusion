var nanofluxDir;

// @ifdef DIST
nanofluxDir = "../dist/nanoflux-fusion";
// @endif

// @ifndef DIST
nanofluxDir = "../src/nanoflux-fusion";
// @endif

var NanoFlux = require(nanofluxDir);

function LoggerMiddleware(){
	var logData = [];

	this.log = function(newState, oldState){
		logData.push({
			new: newState,
			old: oldState
		});

		return newState;
	};

	this.isEmpty = function(){ return logData.length === 0 };

	this.getLogEntry = function(t){
		return logData[t];
	};
}

function ModifyingMiddleware(propName, value){
	this.modify = function(newState, oldState){

		var modifiedState = {};
		modifiedState[propName] = value;

		Object.assign(newState, modifiedState);
		return newState;
	};
}


describe("NanoFlux Fusion Middleware", function () {

	beforeEach(function () {
		NanoFlux.reset();
	});

	it("should add and execute single non-modifying middleware", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var logger = new LoggerMiddleware();
		fusionStore.use( logger.log );

		var subscription = fusionStore.subscribe(this, function (state) {

			expect(logger.isEmpty()).toBeFalsy();

			var entry = logger.getLogEntry(0);
			expect(entry.old.a).toBe("");
			expect(entry.old.b).toBe(0);
			expect(entry.new.a).toBe("fromA");
			expect(entry.new.b).toBeUndefined();

			entry = logger.getLogEntry(1);
			if(entry)
			{
				expect(entry.old.a).toBe("fromA");
				expect(entry.old.b).toBe(0);
				expect(entry.new.b).toBe(42);
				expect(entry.new.a).toBeUndefined();
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

	it("should add and execute multiple state modifying middleware", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var modifierMeta = new ModifyingMiddleware("meta", "Applied");
		var modifierFoo = new ModifyingMiddleware("foo", {bar: 42});
		fusionStore.use( modifierMeta.modify );
		fusionStore.use( modifierFoo.modify );

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.meta).toBe("Applied");
			expect(state.foo).toBeDefined();
			expect(state.foo.bar).toBe(42);
		});

		NanoFlux.createFusionator({
			testA : function(state, args) {
				return {a: args[0]}
			}
		}, {
			a: ""
		});

		var testActorA = NanoFlux.getFusionActor("testA");
		testActorA("fromA");

		subscription.unsubscribe();

	});

});
