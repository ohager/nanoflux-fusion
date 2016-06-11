[![Build Status](https://travis-ci.org/ohager/nanoflux-fusion.svg?branch=master)](https://travis-ci.org/ohager/nanoflux-fusion)



# nanoflux-fusion

[__PROJECT SITE__](http://ohager.github.io/nanoflux/)

> Note: This is still a very early version and considered as a developer preview

A Redux-like extension for Nanoflux.

*nanoflux-fusion* is built on top of [nanoflux](https://github.com/ohager/nanoflux), a quite efficient Flux implementation,  
and adopts the concept of reducer functions for application state management, making Flux even more comfortable.

## Concept

[Dan Abramov](https://github.com/gaearon) pushed the Flux evolution with [Redux](http://redux.js.org/) and proved that application 
state management is possible with a very minimalistic approach. The idea of using reducer functions to alter the state
is very elegant. *nanoflux-fusion* adopts the idea of reducer functions (called *Fusionators*, because naming is fun) to make Flux even more comfortable.
That way, it's not necessary to define any Store. The user just focus on *how* he wants to alter the state using
functions the simply return the new state.

### Example

```javascript

	var NanoFlux = require('nanoflux-fusion');
	
	// NanoFlux provides a dedicated store
	var fusionStore = NanoFlux.getFusionStore();
	
	// subscription is the same as in NanoFlux, note that the function passes a state (which is immutable)
	var subscription = fusionStore.subscribe(this, function(state){
		// ... do something with the state
		// state is also available via fusionStore.getState()
		console.log("Items:", state.items);
	});
	
	// this function allows the state manipulation
	// it is called with two arguments, the previous state
	// and an action object of the following structure:
	// { id: <actionId>, args : <array of arguments> }
	function myFusionator(previousState, action){
	
		switch(action.id){
			case "addItem":
				var currentItems = previousState.items ? previousState.items.slice() :[] ;
				currentItems.push(action.args[0]);
				return { items : currentItems };
			case "removeItem":
				if (!previousState.items || previousState.items.length == 0) return {};
	
				var items = previousState.items.filter(function (item) {
					return item.name !== action.args[0];
				});
				return {items: items}
		}
	}
	
	// creates the fusion actors, which results in our reducer function ("fusionator")
	var addItem = NanoFlux.createFusionActor(myFusionator, "addItem");
	var removeItem = NanoFlux.createFusionActor(myFusionator, "removeItem");
	
	// call the actions
	addItem({ name: "item1", value : 1 });
	addItem({ name: "item2", value : 2 });
	
	removeItem("item1");

```


TODO

- More Test, especially test for eventual side-effects on nanoflux
- More examples
- Doc for project site


