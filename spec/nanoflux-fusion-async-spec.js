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

const ASYNC_DELAY_MS = 100;

function asyncA(){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve("fromAsyncA");
		}, ASYNC_DELAY_MS)
	})
}

function asyncB(){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve({ a: "fromAsyncB" });
		}, ASYNC_DELAY_MS)
	})
}

function asyncQ(){
	var deferred = Q.defer();

	setTimeout(function(){
			deferred.resolve({ q: "fromAsyncQ" });
	}, ASYNC_DELAY_MS);

	return deferred.promise;
}

function asyncRSVP(){
	return new RSVP.Promise(function(resolve, reject){
		setTimeout(function(){
			resolve({ rsvp: "fromAsyncRSVP" });
		}, ASYNC_DELAY_MS)
	})
}


function asyncBluebird(){
	return new Bluebird(function(resolve, reject){
		setTimeout(function(){
			resolve({ bb: "fromAsyncBluebird" });
		}, ASYNC_DELAY_MS)
	})
}

var asyncFusionatorDecriptor = {
	test: function(state, args) {
		return new Promise(function(resolve, reject){
			// simulating async operation
			setTimeout(function(){
				// resolve to new state
				resolve({a: args[0], b: args[1]});
			}, ASYNC_DELAY_MS);
		});
	},
	rejectionTest : function(){
		return new Promise(function(resolve, reject){
			// simulating async operation
			setTimeout(function(){
				reject("Reject Test");
			}, ASYNC_DELAY_MS);
		});
	},
	chainTest: function() {
		return asyncA().then(function(data){
			return asyncB();
		});
	},
	qTest: function() {
		return asyncQ();
	},
	rsvpTest: function() {
		return asyncRSVP();
	},
	bluebirdTest: function() {
		return asyncBluebird();
	}
};

var initialState = {
	a: "",
	b : {
		foo: "",
		bar: 0
	},
	q:"",
	rsvp:"",
	bb:""
};

describe("NanoFlux Fusion Asynchronous", function () {

	beforeEach(function () {
		NanoFlux.reset();
		NanoFlux.createFusionator(asyncFusionatorDecriptor, initialState);
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

		var testActor = NanoFlux.getFusionActor("test");

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

		NanoFlux.getFusionActor("chainTest")();
	});

	it("should be able handle rejections (async)", function (done) {

		var fusionStore = NanoFlux.getFusionStore();

		var spy = { callback : function(state){
			expect(true).toBeFalsy(); // will fail here, if called!
			done();
		} };

		var spiedFunc = spyOn(spy, 'callback');
		var subscription = fusionStore.subscribe(this, spy.callback);

		var testActor = NanoFlux.getFusionActor("rejectionTest");

		testActor("someValue", {foo: "foo", bar: 123});

		setTimeout(function(){
			expect(spiedFunc).not.toHaveBeenCalled();
			subscription.unsubscribe();
			done();
		}, 250)


	});

	it("should be able to deal with Promise Chains (async)", function (done) {

		// when calling here, async should already be executed
		var fusionStore = NanoFlux.getFusionStore();

		subscription = fusionStore.subscribe(this, function(state){
			expect(state.a).toBe("fromAsyncB");
			subscription.unsubscribe();
			done();
		});

		NanoFlux.getFusionActor("chainTest")();
	});

	it("should work with Q (A+ compliant promise lib)(async)", function (done) {

		// when calling here, async should already be executed
		var fusionStore = NanoFlux.getFusionStore();

		subscription = fusionStore.subscribe(this, function(state){
			expect(state.q).toBe("fromAsyncQ");
			subscription.unsubscribe();
			done();
		});

		NanoFlux.getFusionActor("qTest")();
	});

	it("should work with RSVP (A+ compliant promise lib)(async)", function (done) {

		// when calling here, async should already be executed
		var fusionStore = NanoFlux.getFusionStore();

		subscription = fusionStore.subscribe(this, function(state){
			expect(state.rsvp).toBe("fromAsyncRSVP");
			subscription.unsubscribe();
			done();
		});

		NanoFlux.getFusionActor("rsvpTest")();
	});

	it("should work with Bluebird (A+ compliant promise lib)(async)", function (done) {

		// when calling here, async should already be executed
		var fusionStore = NanoFlux.getFusionStore();

		subscription = fusionStore.subscribe(this, function(state){
			expect(state.bb).toBe("fromAsyncBluebird");
			subscription.unsubscribe();
			done();
		});

		NanoFlux.getFusionActor("bluebirdTest")();
	});


	it("actors should be usable within actions (async)", function (done) {

		var fusionStore = NanoFlux.getFusionStore();

		var fusionator = NanoFlux.createFusionator({
			actionA : function(state, args){
				return {a: args[0]}
			}
		}, {a : ""});

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.a).toBe("fromActionA");
			done();
		});

		var actorA = NanoFlux.getFusionActor("actionA");
		var actions = NanoFlux.createActions('action', null, {
				test: function (a) {
					setTimeout(actorA.bind(null, a), ASYNC_DELAY_MS)
				}
			}
		);

		actions.test("fromActionA");
	})


});
