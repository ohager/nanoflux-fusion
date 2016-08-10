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

	it("should initialize state with initial state", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.a).toBe("fromTestActor");
			expect(state.b.foo).toBe("foo");
			expect(state.b.bar).toBe(0);
		});

		var initalState = {
			a :  "default",
			b: { foo: "foo", bar: 0}
		};

		NanoFlux.createFusionator({
			test : function(state, args) {
				return { a: args[0]};
			}
		}, initalState);

		// test initial state
		var state = NanoFlux.getFusionStore().getState();
		expect(state.a).toBe("default");
		expect(state.b.foo).toBe("foo");
		expect(state.b.bar).toBe(0);

		// test default state on call
		var testActor = NanoFlux.getFusionActor("test");
		testActor("fromTestActor");

		subscription.unsubscribe();


	});

	it("should use FusionActor 'test', fuse state and notify subscriber", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.a).toBe("someValue");
			expect(state.b.foo).toBe("foo");
			expect(state.b.bar).toBe(123);
		});

		var initalState = {
			a :  "default",
			b: { foo: "foo", bar: 0}
		};


		NanoFlux.createFusionator({
			test : function(state, args) {
				return {a: args[0], b: args[1]}
			}
		}, initalState);

		var testActor = NanoFlux.getFusionActor("test");
		testActor("someValue", {foo: "foo", bar: 123});

		subscription.unsubscribe();

	});

	it("should merge state without overwriting", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var initialState = {
			initial: "initialState",
			a :  "default",
			b: { other: "default" }
		};

		NanoFlux.createFusionator({
			init: function(state, args){
				return {initial: args[0]}
			},
			test : function(state, args){
				return {a: args[0], b: args[1]}
			}
		}, initialState);

		var test2Actor = NanoFlux.getFusionActor("test");

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
		}, {a: ""}, "fusionatorA");

		var fusionatorB = NanoFlux.createFusionator({
			actionB : function(state, args) {
				return {b: args[0]}
			}
		}, {b: ""}, "fusionatorB");

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

	it("should be that multiple fusionators have merged initial state", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var fusionatorA = NanoFlux.createFusionator({
			actionA : function (state, args){
				return {a: args[0]}
			}
		}, {a: "default"}, "fusionatorA");

		var fusionatorB = NanoFlux.createFusionator({
			actionB : function(state, args) {
				return {b: args[0]}
			}
		}, {b: "default"}, "fusionatorB");

		var initialState = NanoFlux.getFusionStore().getState();
		expect(initialState.a).toBe("default");
		expect(initialState.b).toBe("default");

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.a).toBe("fromFusionatorA");
			expect(state.b).toBe("default");
		});

		var fusionatorAActor = NanoFlux.getFusionActor("actionA", "fusionatorA");

		fusionatorAActor("fromFusionatorA");

		subscription.unsubscribe();

	});

	it("should work with multiple fusionators without naming collision (namespaces)", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var fusionatorA = NanoFlux.createFusionator({
			actionA : function (state, args){
				return {a: args[0]}
			}
		}, {a: ""}, "fusionatorA");

		var fusionatorB = NanoFlux.createFusionator({
			actionA : function(state, args) {
				return {b: args[0]}
			}
		}, {b: ""}, "fusionatorB");

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
		}, {b : ""});

		expect(NanoFlux.getFusionActor.bind(null,"actionA")).toThrow();
	});

	it("should throw exception on invalid fusionator", function () {
		expect(NanoFlux.getFusionActor.bind(null,"actionB", "unknown")).toThrow();
	});

	it("should throw exception if no initial state is defined", function () {

		expect(NanoFlux.createFusionator.bind(null, {
			test : function(state, args) {
				return state;
			}
		})).toThrow();

	});

});
