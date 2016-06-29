var nanofluxDir;

// @ifdef DIST
nanofluxDir = "../dist/nanoflux-fusion";
// @endif

// @ifndef DIST
nanofluxDir = "../src/nanoflux-fusion";
// @endif

var NanoFlux = require(nanofluxDir);
var Q = require('q');
var RSVP = require('rsvp');
var Bluebird = require('bluebird');

const ASNYC_DELAY_MS = 100;

function asyncA(){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve("fromAsyncA");
		}, ASNYC_DELAY_MS)
	})
}

function asyncB(){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve({ a: "fromAsyncB" });
		}, ASNYC_DELAY_MS)
	})
}

function asyncQ(){
	var deferred = Q.defer();

	setTimeout(function(){
			deferred.resolve({ q: "fromAsyncQ" });
	}, ASNYC_DELAY_MS);

	return deferred.promise;
}

function asyncRSVP(){
	return new RSVP.Promise(function(resolve, reject){
		setTimeout(function(){
			resolve({ rsvp: "fromAsyncRSVP" });
		}, ASNYC_DELAY_MS)
	})
}


function asyncBluebird(){
	return new Bluebird(function(resolve, reject){
		setTimeout(function(){
			resolve({ bb: "fromAsyncBluebird" });
		}, ASNYC_DELAY_MS)
	})
}

function asyncFusion(state, action) {
	if (action.id === "test") {
		return new Promise(function(resolve, reject){
			// simulating async operation
			setTimeout(function(){
				// resolve to new state
				resolve({a: action.args[0], b: action.args[1]});
			}, ASNYC_DELAY_MS);
		});
	}
	else if(action.id === "chainTest"){
		return asyncA().then(function(data){
			return asyncB();
		});
	}
	else if(action.id === "qTest"){
		return asyncQ();
	}
	else if(action.id === "rsvpTest"){
		return asyncRSVP();
	}
	else if(action.id === "bluebirdTest"){
		return asyncBluebird();
	}
}


describe("NanoFlux Fusion Asynchronous", function () {

	beforeEach(function () {
		NanoFlux.reset();
	});

	it("should be able to deal with Promises as FusionActor (async)", function (done) {

		// when calling here, async should already be executed
		var fusionStore = NanoFlux.getFusionStore();

		var subscription = fusionStore.subscribe(this, function(state){
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

	it("should work with RSVP (A+ compliant promise lib)(async)", function (done) {

		// when calling here, async should already be executed
		var fusionStore = NanoFlux.getFusionStore();

		subscription = fusionStore.subscribe(this, function(state){
			expect(state.rsvp).toBe("fromAsyncRSVP");
			subscription.unsubscribe();
			done();
		});

		NanoFlux.createFusionActor(asyncFusion, "rsvpTest")();
	});

	it("should work with Bluebird (A+ compliant promise lib)(async)", function (done) {

		// when calling here, async should already be executed
		var fusionStore = NanoFlux.getFusionStore();

		subscription = fusionStore.subscribe(this, function(state){
			expect(state.bb).toBe("fromAsyncBluebird");
			subscription.unsubscribe();
			done();
		});

		NanoFlux.createFusionActor(asyncFusion, "bluebirdTest")();
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
					setTimeout(actorA.bind(null, a), ASNYC_DELAY_MS)
				}
			}
		);

		actions.test("fromActionA");
	})


});
