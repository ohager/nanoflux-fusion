var nanofluxDir;

// @ifdef DIST
nanofluxDir = "../dist/nanoflux-fusion";
// @endif

// @ifndef DIST
nanofluxDir = "../src/nanoflux-fusion";
// @endif

var NanoFlux = require(nanofluxDir);

describe("NanoFlux Fusion", function () {

	beforeEach(function () {
		NanoFlux.reset();
	});

	it("verify Fusion API existence after reset", function () {
		expect(NanoFlux.getFusionStore).toBeDefined();
		//expect(NanoFlux.createFusionActor).toBeDefined();
		expect(NanoFlux.createFusionator).toBeDefined();
	});

	it("should use FusionActor 'test', fuse state and notify subscriber", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.a).toBe("someValue");
			expect(state.b.foo).toBe("foo");
			expect(state.b.bar).toBe(123);
		});

		NanoFlux.createFusionator({
			test : function(state, args) {
				return {a: args[0], b: args[1]}
			}
		});
		var testActor = NanoFlux.getFusionActor("test");
		testActor("someValue", {foo: "foo", bar: 123});

		subscription.unsubscribe();

	});

	it("should merge state without overwriting", function () {

		var fusionStore = NanoFlux.getFusionStore();

		NanoFlux.createFusionator({
			init: function(state, args){
				return {initial: args[0]}
			},
			test : function(state, args){
				return {a: args[0], b: args[1]}
			}
		});

		var initialStateActor = NanoFlux.getFusionActor("init");
		var test2Actor = NanoFlux.getFusionActor("test");

		// no callback yet
		initialStateActor("initialState");

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.initial).toBe("initialState");
			expect(state.a).toBe("test");
			expect(state.b.other).toBe("other");
		});

		test2Actor("test", {other: "other"});

		subscription.unsubscribe();

	});

	it("should work with multiple fusionators (namespaces)", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var fusionatorA = NanoFlux.createFusionator({
			actionA : function (state, args){
				return {a: args[0]}
			}
		}, "fusionatorA");

		var fusionatorB = NanoFlux.createFusionator({
			actionB : function(state, args) {
				return {b: args[0]}
			}
		}, "fusionatorB");

		var subscription = fusionStore.subscribe(this, function (state) {
			if (state.a) {
				expect(state.a).toBe("fromFusionatorA");
			}
			if (state.b) {
				expect(state.b).toBe("fromFusionatorB");
			}
		});

		// first fusionator
		var fusionatorAActor = NanoFlux.getFusionActor("actionA", "fusionatorA");
		var fusionatorBActor = NanoFlux.getFusionActor("actionB", "fusionatorB");

		fusionatorAActor("fromFusionatorA");
		fusionatorBActor("fromFusionatorB");

		subscription.unsubscribe();

	});

	it("should work with multiple fusionators without naming collision (namespaces)", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var fusionatorA = NanoFlux.createFusionator({
			actionA : function (state, args){
				return {a: args[0]}
			}
		}, "fusionatorA");

		var fusionatorB = NanoFlux.createFusionator({
			actionA : function(state, args) {
				return {b: args[0]}
			}
		}, "fusionatorB");

		var subscription = fusionStore.subscribe(this, function (state) {
			if (state.a) {
				expect(state.a).toBe("fromFusionatorA");
			}
			if (state.b) {
				expect(state.b).toBe("fromFusionatorB");
			}
		});

		// first fusionator
		var fusionatorAActor = NanoFlux.getFusionActor("actionA", "fusionatorA");
		var fusionatorBActor = NanoFlux.getFusionActor("actionA", "fusionatorB");

		fusionatorAActor("fromFusionatorA");
		fusionatorBActor("fromFusionatorB");

		subscription.unsubscribe();

	});

	it("should throw exception on unknown fusion actor", function () {

		NanoFlux.createFusionator({
			actionB : function(state, args) {
				return {b: args[0]}
			}
		});

		expect(NanoFlux.createFusionActor.bind(null,"actionA")).toThrow();
	});

	it("should throw exception on invalid fusionator", function () {
		expect(NanoFlux.createFusionActor.bind(null,"actionB", "unknown")).toThrow();
	});

});
