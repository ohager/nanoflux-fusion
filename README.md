[![Build Status](https://travis-ci.org/ohager/nanoflux-fusion.svg?branch=master)](https://travis-ci.org/ohager/nanoflux-fusion)

# nanoflux-fusion

[__PROJECT SITE__](http://ohager.github.io/nanoflux/)

A Redux-like extension for Nanoflux.

This extension uses the concept of reducer functions for application state management.

## Concept


# Example

```javascript

	var NanoFlux = require('nanoflux-fusion/dist/nanoflux-fusion.min');
	
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


