/*
	Target syntax:
	
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
*/

(function () {
	var cla$$Prototype = new Cla$$Prototype();
	
	// Make our input a bit more cla$$y
	function cla$$(item) {
		var proto;
		if (typeof item === "function") {
			Cla$$Prototype.call(item);
			proto = item;
		} else {
			function Cla$$CustomPrototype() {}
			Cla$$CustomPrototype.prototype = item;
			proto = new Cla$$CustomPrototype();
			
			for (var prop in cla$$Prototype) {
				var newer = item[prop];
				var orig = cla$$Prototype[prop];
				
				if (newer == null) {
					proto[prop] = orig;
				}
			}
		}
		
		return proto;
	}
	cla$$.Prototype = Cla$$Prototype;
	cla$$.mixin = function (target, Mixer, config) {
		config = config || {};
		Mixer.call(target, config);
	};
	window.cla$$ = cla$$;
	
	cla$$.def = cla$$.define = function () {
		var config = this.def.getConfig(arguments);
		var $uper = config.$uper || cla$$Prototype,
		cla$$ = config.cla$$ || function () {};
		var proto = this.def.getPrototype($uper);
		
		// Give cla$$ any static properties we want
		cla$$Configure(cla$$, proto);
		
		// Add some helpful shortcuts to the prototype
		Cla$$Prototype.configure(cla$$, proto);
		
		// Make an "_" shortcut for each function in the prototype (except the constructor)
		// Just pass in the arguments array, and it will call `apply` for you.
		for (var prop in proto) {
			var item = proto[prop];
			
			if (!proto.hasOwnProperty(prop)
				|| typeof item !== "function"
				|| prop === "$$"
				|| prop === "cla$$"
				|| prop === "constructor")
				continue;
			
			makeUnderscoreShortcutMethod(proto, item);
		}
		
		return cla$$;
	};
	
	cla$$.def.getConfig = function (args) {
		var arg0 = args[0];
		if (typeof arg0 === "function")
			config = { cla$$: arg0 };
		else
			config = arg0 || {};
		return config
	};
	
	cla$$.def.getPrototype = function ($uper) {
		if (typeof $uper === "function" && !this.isCla$$Prototype) {
			proto = new $uper();
		} else proto = $uper;
		return proto;
	};
	
	function cla$$Configure(newCla$$, proto) {
		// Give cla$$ any static properties we want
		newCla$$.isCla$$ = true;
		newCla$$.prototype = proto;
		newCla$$._new_ = newCla$$.make = makeNew;
		newCla$$.extend = function () {
			var config = cla$$.def.getConfig(arguments);
			config.$uper = this;
			return cla$$.def(config);
		};
	}
	
	function makeUnderscoreShortcutMethod(proto, fn) {
		if (fn._ == null) {
			fn._ = function (args) {
				fn.apply(proto, args);
			};
		}
	}
	
	function makeNew() {
		var ret = new this();
		if (ret.isCla$$Prototype && typeof ret.init === "function")
			ret.init.apply(ret, arguments);
		
		return ret;
	}
	
	function Cla$$Prototype() {
		// Will let us know if this prototype is ready to be used as-is (without being init'd)
		this.isCla$$Prototype = true;
		
		// These are written to when a class is created.
		this.$uper;
		this.$;
		this.cla$$;
		this.$$;
		
		this._ = function (fn) {
			var ret;
			if (Function.prototype.bind)
				ret = fn.bind(this);
			else
				ret = function () { fn.apply(this, arguments) };
			
			return ret;
		};
		
		this.mixin = this.include = function (Mixer, config) {
			return cla$$.mixin(this, Mixer, config);
		};
	}
	Cla$$Prototype.configure = function (cla$$, proto) {
		proto.$$ = proto.cla$$ = proto.constructor = cla$$;
		proto.$ = proto.$uper = proto;
	};
})();