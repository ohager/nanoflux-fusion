var nanofluxDir;

// @ifdef DIST
nanofluxDir = "../dist/nanoflux-fusion";
// @endif

// @ifndef DIST
nanofluxDir = "../src/nanoflux-fusion";
// @endif

var NanoFlux = require(nanofluxDir);

describe("NanoFlux Fusion Immutability", function () {

	beforeEach(function () {
		NanoFlux.reset();
	});

	it("should pass immutable object on notification", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var subscription = fusionStore.subscribe(this, function (state) {

			state.a = "changed";
			state.b = { a: "A", b: "B"};

			var gotState = fusionStore.getState();

			// no changes, due to immutability
			expect(state.a).toBe(gotState.a);
			expect(state.b).toBe(gotState.b);
			
			expect(gotState.a).toBe("someValue");
			expect(gotState.b.foo).toBe("foo");
		});

		NanoFlux.createFusionator({
			test : function(state, args) {
				return {a: args[0], b: args[1]}
			}
		}, {
			a: "",
			b : {
				foo : "",
				bar : 0
			}
		});
		var testActor = NanoFlux.getFusionActor("test");
		testActor("someValue", {foo: "foo", bar: 123});

		subscription.unsubscribe();

	});

	it("should have immutable arrays also", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var subscription = fusionStore.subscribe(this, function (state) {

			state.a = [ 1,2 ];

			var gotState = fusionStore.getState();

			// no changes, due to immutability
			expect(state.a).toBe(gotState.a);

			expect(gotState.a[0]).toBe("someValue");
			expect(gotState.a[1].foo).toBe("foo");
		});

		NanoFlux.createFusionator({
			test : function(state, args) {
				return {a: [ args[0], args[1] ]}
			}
		},
		{
			a : []
		});
		var testActor = NanoFlux.getFusionActor("test");
		testActor("someValue", {foo: "foo", bar: 123});

		subscription.unsubscribe();

	});

});
