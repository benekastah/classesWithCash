#cla$$
---

```javascript
var Person = ClasS.def({
	// Some useful $uper configurations:
	$uper: someCla$$,						// should check to see if it is made from our Class object and act accordingly
	$uper: { ... },							// Uses a simple object as the $uper. This
	$uper: cla$$(someFn),					// This ensures that we won't mistake `someFn` as a class. Mainly used for functions, because they look like classes.
	$uper: cla$$({ ... }),					// This makes whatever object you pass in the prototype of another object, which becomes the $uper. Useful if you are using mixins and don't want to modify the original object.
	
	cla$$: function () {
		// Automatically called
		this.init = function (config, callback) {
			// Mixin. It's an alias to this.include.
			this.mixin(someMixer);
			// Alternate mixin method. Useful to add normal cla$$ functionality to one that doesn't have a cla$$ prototype (may happen when using a simple object as $uper)
			cla$$.mixin(someMixer, this);
			
			// Needs to be explicitly called
			this.$uper.init(arguments);
			// Alternately, the prototype can be accessed like this
			this.$.init(arguments);
		}
		
		// Define private methods
		var doSomething = this._(function () {
			// you can use `this` in here! The `_` function handles binding.
			this.aGame = true;
		});
		
		// Access and set static methods and properties
		this.$$.someMethod = function () { // Can also use this.cla$$.someMethod
			// Note: `this` now refers to the class itself
			this.awesome = true;
		}
	}
});

var jim = Person.make({name: "Jim", age: "24"});
```