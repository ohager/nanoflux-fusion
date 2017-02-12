var nanofluxDir;

// @ifdef DIST
nanofluxDir = "../dist/nanoflux-fusion";
// @endif

// @ifndef DIST
nanofluxDir = "../src/nanoflux-fusion";
// @endif

var NanoFlux = require(nanofluxDir);

function LoggerMiddleware() {
	var logData = [];

	this.log = function (newState, oldState, actionName) {
		logData.push({
			new: newState,
			old: oldState,
			action: actionName
		});

		return newState;
	};

	this.isEmpty = function () {
		return logData.length === 0
	};

	this.getLogEntry = function (t) {
		return logData[t];
	};
}

function ModifyingMiddleware(propName, value) {
	this.modify = function (newState, oldState, actorName) {

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
		fusionStore.use(logger.log);

		var subscription = fusionStore.subscribe(this, function (state) {

			expect(logger.isEmpty()).toBeFalsy();

			var entry = logger.getLogEntry(0);
			expect(entry.action).toBe("testA");
			expect(entry.old.a).toBe("");
			expect(entry.old.b).toBe(0);
			expect(entry.new.a).toBe("fromA");
			expect(entry.new.b).toBeUndefined();

			entry = logger.getLogEntry(1);
			if (entry) {
				expect(entry.action).toBe("testB");
				expect(entry.old.a).toBe("fromA");
				expect(entry.old.b).toBe(0);
				expect(entry.new.b).toBe(42);
				expect(entry.new.a).toBeUndefined();
			}

		});

		NanoFlux.createFusionator({
			testA: function (state, args) {
				return {a: args[0]}
			},
			testB: function (state, args) {
				return {b: args[0]}
			}
		}, {
			a: "",
			b: 0
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
		fusionStore.use(modifierMeta.modify);
		fusionStore.use(modifierFoo.modify);

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.meta).toBe("Applied");
			expect(state.foo).toBeDefined();
			expect(state.foo.bar).toBe(42);
		});

		NanoFlux.createFusionator({
			testA: function (state, args) {
				return {a: args[0]}
			}
		}, {
			a: ""
		});

		var testActorA = NanoFlux.getFusionActor("testA");
		testActorA("fromA");

		subscription.unsubscribe();

	});
	it("should apply for multiple Fusionators", function () {

		var fusionStore = NanoFlux.getFusionStore();

		var modifierMeta = new ModifyingMiddleware("meta", "Applied");
		var modifierFoo = new ModifyingMiddleware("foo", {bar: 42});
		fusionStore.use(modifierMeta.modify);
		fusionStore.use(modifierFoo.modify);

		var subscription = fusionStore.subscribe(this, function (state) {
			expect(state.meta).toBe("Applied");
			expect(state.foo).toBeDefined();
			expect(state.foo.bar).toBe(42);
			if (state.a) {
				expect(state.a).toBe("fromFusionatorA");
			}
			if (state.b) {
				expect(state.b).toBe("fromFusionatorB");
			}
		});

		var fusionatorA = NanoFlux.createFusionator({
			actionA: function (state, args) {
				return {a: args[0]}
			}
		}, {a: ""}, "fusionatorA");

		var fusionatorB = NanoFlux.createFusionator({
			actionA: function (state, args) {
				return {b: args[0]}
			}
		}, {b: ""}, "fusionatorB");

		var fusionatorAActor = NanoFlux.getFusionActor("actionA", "fusionatorA");
		var fusionatorBActor = NanoFlux.getFusionActor("actionA", "fusionatorB");

		fusionatorAActor("fromFusionatorA");
		fusionatorBActor("fromFusionatorB");
		subscription.unsubscribe();

	});

	it("should apply middleware for async Fusionators", function (done) {

		var fusionStore = NanoFlux.getFusionStore();

		var logger = new LoggerMiddleware();
		NanoFlux.getFusionStore().use( logger.log );

		function async() {
			return new Promise(function (resolve, reject) {
				setTimeout(function () {
					resolve({ a: "fromAsync" });
				}, 100)
			})
		}

		NanoFlux.createFusionator({
				asyncAction: function () {
					return async();
				}
			}
			, { a: "" });

		var subscription = fusionStore.subscribe(this, function (state) {

			expect(state.a).toBe("fromAsync");
			expect(logger.isEmpty()).toBeFalsy();
			var entry = logger.getLogEntry(0);
			expect(entry.action).toBe("asyncAction");
			subscription.unsubscribe();
			done();
		});

		var asyncActor = NanoFlux.getFusionActor("asyncAction");
		asyncActor();

	});


});
