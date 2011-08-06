try {
  if (exports == null) throw "";
  if (module.exports == null) throw "";
} catch (e) {
  var exports = window;
  var module = {};
}

(function (exports) {
  
  var Cla$$Prototype;
  (function () {
	  Cla$$Prototype = function () {
	    this.$$ = this.cla$$ = this.constructor;
	    this.$ = this.$uper = this.constructor.prototype;
	    
	    this.isCla$$Prototype = true;
	    
	    this._ = function (fn) {
  			var ret;
  			if (Function.prototype.bind)
  				ret = fn.bind(this);
  			else
  				ret = function () { return fn.apply(this, arguments) };

  			return ret;
  		};
  		
  		this.mixin = this.include = cla$$PrototypeMixin;
	  }

  	Cla$$Prototype.configure = function (cla$$, proto) {
  	  proto.$$ = proto.cla$$ = proto.constructor;
  	  proto.$ = proto.$uper = proto.constructor.prototype;
  		proto.constructor = cla$$;
  	};

  	function cla$$PrototypeMixin(Mixer, config) {
  		return cla$$.mixin(this, Mixer, config);
  	}
	})();
  
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
	module.exports = cla$$;
	
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
		addShortcutsOnClassInit.call(ret, this.prototype, this);
		
		if (ret.isCla$$Prototype && typeof ret.init === "function")
			ret.init.apply(ret, arguments);
		
		return ret;
	}
	
	function addShortcutsOnClassInit($uper, cla$$) {
	  this.$ = this.$uper = $uper;
    this.$$ = this.cla$$ = cla$$;
	}
	
})(exports);

try {
  if (exports === window) {
    window.cla$$ = module.exports;
  }
} catch (e) {}