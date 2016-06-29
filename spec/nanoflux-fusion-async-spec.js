var nanofluxDir;

// @ifdef DIST
nanofluxDir = "../dist/nanoflux-fusion";
// @endif

// @ifndef DIST
nanofluxDir = "../src/nanoflux-fusion";
// @endif

var NanoFlux = require(nanofluxDir);
var q = require('../node_modules/q/q');
var subscription;


function asyncA(){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve("fromAsyncA");
		}, 500)
	})
}

function asyncB(){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve({ a: "fromAsyncB" });
		}, 500)
	})
}

function asyncQ(){
	var deferred = q.defer();

	setTimeout(function(){
			deferred.resolve({ q: "fromAsyncQ" });
	}, 500);

	return deferred.promise;
}


function asyncFusion(state, action) {
	if (action.id === "test") {
		return new Promise(function(resolve, reject){
			// simulating async operation
			setTimeout(function(){
				// resolve to new state
				resolve({a: action.args[0], b: action.args[1]});
			}, 500);
		});
	}
	else if(action.id === "chainTest"){
		return asyncA().then(function(data){
			console.log(data);
			return asyncB();
		});
	}
	else if(action.id === "qTest"){
		return asyncQ();
	}
}


describe("NanoFlux Fusion Asynchronous", function () {

	beforeEach(function () {
		NanoFlux.reset();
	});

	it("should be able to deal with Promises as FusionActor (async)", function (done) {

		// when calling here, async should already be executed
		var fusionStore = NanoFlux.getFusionStore();

		subscription = fusionStore.subscribe(this, function(state){
			expect(state.a).toBe("someValue");
			expect(state.b.foo).toBe("foo");
			expect(state.b.bar).toBe(123);
			subscription.unsubscribe();
			done();
		});

		var testActor = NanoFlux.createFusionActor(asyncFusion, "test");

		testActor("someValue", {foo: "foo", bar: 123});
	});

	it("should be able to deal with Promise Chains (async)", function (done) {

		// when calling here, async should already be executed
		var fusionStore = NanoFlux.getFusionStore();

		subscription = fusionStore.subscribe(this, function(state){
			expect(state.a).toBe("fromAsyncB");
			subscription.unsubscribe();
			done();
		});

		NanoFlux.createFusionActor(asyncFusion, "chainTest")();
	});

	it("should work with Q (A+ compliant promise lib)(async)", function (done) {

		// when calling here, async should already be executed
		var fusionStore = NanoFlux.getFusionStore();

		subscription = fusionStore.subscribe(this, function(state){
			expect(state.q).toBe("fromAsyncQ");
			subscription.unsubscribe();
			done();
		});

		NanoFlux.createFusionActor(asyncFusion, "qTest")();
	});


	it("actors should be usable within actions (async)", function (done) {

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
