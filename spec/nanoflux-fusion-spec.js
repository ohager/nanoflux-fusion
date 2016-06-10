var nanofluxDir;

// @ifdef DIST
nanofluxDir = "../dist/nanoflux-fusion";
// @endif

// @ifndef DIST
nanofluxDir = "../src/nanoflux-fusion";
// @endif

var NanoFlux = require(nanofluxDir);

describe("NanoFlux Fusion", function () {
	
	it("should use FusionActor 'test', fuse state and notify subscriber", function () {
		
		var fusionStore = NanoFlux.getFusionStore();

		var subscription = fusionStore.subscribe(this, function(state){
			expect(state.a).toBe("someValue");
			expect(state.b.foo).toBe("foo");
			expect(state.b.bar).toBe(123);
		});

		function myFusion(state, action){
			if(action.id === "test"){
				return { a: action.args[0], b: action.args[1] }
			}
		}

		var testActor = NanoFlux.createFusionActor(myFusion, "test");

		testActor("someValue",{ foo: "foo", bar: 123} );

		subscription.unsubscribe();

	});


});
