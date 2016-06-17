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
		expect(NanoFlux.createFusionActor).toBeDefined();
	});

	it("should use FusionActor 'test', fuse state and notify subscriber", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.a).toBe("someValue");
			expect(state.b.foo).toBe("foo");
			expect(state.b.bar).toBe(123);
		});

		function myFusion(state, action) {
			if (action.id === "test") {
				return {a: action.args[0], b: action.args[1]}
			}
		}

		var testActor = NanoFlux.createFusionActor(myFusion, "test");
		testActor("someValue", {foo: "foo", bar: 123});

		subscription.unsubscribe();

	});

	it("should merge state without overwriting", function () {

		var fusionStore = NanoFlux.getFusionStore();

		function myFusion(state, action) {
			if (action.id === "init") {
				return {initial: action.args[0]}
			}
			if (action.id === "test") {
				return {a: action.args[0], b: action.args[1]}
			}
		}

		var initialStateActor = NanoFlux.createFusionActor(myFusion, "init");
		var test2Actor = NanoFlux.createFusionActor(myFusion, "test");

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

	it("should work with multiple fusionators", function () {

		var fusionStore = NanoFlux.getFusionStore();

		function fusionatorA(state, action) {
			if (action.id === "actionA") {
				return {a: action.args[0]}
			}
		}

		function fusionatorB(state, action) {
			if (action.id === "actionB") {
				return {b: action.args[0]}
			}
		}

		var subscription = fusionStore.subscribe(this, function (state) {
			if (state.a) {
				expect(state.a).toBe("fromFusionatorA");
			}
			if (state.b) {
				expect(state.b).toBe("fromFusionatorB");
			}
		});

		// first fusionator
		var fusionatorAActor = NanoFlux.createFusionActor(fusionatorA, "actionA");
		var fusionatorBActor = NanoFlux.createFusionActor(fusionatorB, "actionB");

		fusionatorAActor("fromFusionatorA");
		fusionatorBActor("fromFusionatorB");

		subscription.unsubscribe();

	});


	it("actors should be usable within actions (making async call)", function (done) {

		var fusionStore = NanoFlux.getFusionStore();

		function fusionatorA(state, action) {
			if (action.id === "actionA") {
				return {a: action.args[0]}
			}
		}

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.a).toBe("fromActionA");
			done();
		});

		var actorA = NanoFlux.createFusionActor(fusionatorA, "actionA");
		var actions = NanoFlux.createActions('action', null, {
				test: function (a) {
					setTimeout(actorA.bind(null, a), 500)
				}
			}
		);

		actions.test("fromActionA");
	})

});
