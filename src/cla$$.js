try {
  if (exports == null) throw "";
  if (module.exports == null) throw "";
} catch (e) {
  var exports = window;
  var module = {};
}

(function () {
  
  var Cla$$Prototype,
  // Clever way to find out if we can look at a function's contents
  fnTest = /xyz/.test(function(){xyz;}) ? /\$uper\b/ : /.*/,
  initialize = true;
  
  (function () {
	  Cla$$Prototype = function () {
	    this.$$ = this.cla$$ = this.constructor;
	    this.$ = this.constructor.prototype;
	    
	    this.isCla$$Prototype = true;
	    
	this._ = function (fn) {
		var ret;
		if (Function.prototype.bind)
			this._ = function (fn) { return fn.bind(this) };
		else
			this._ = function (fn) { return function () { return fn.apply(this, arguments) } };

		return this._(fn);
	};
  		
  		this.mixin = this.include = cla$$PrototypeMixin;
	  }

		Cla$$Prototype.configure = function (cla$$, proto) {
		  proto.$$ = proto.cla$$ = proto.constructor;
		  proto.$ = proto.$uper = proto.constructor.prototype;
		  if (cla$$)
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
			proto.no_constructor = true;
		} else {
			function Cla$$CustomPrototype() {}
			Cla$$CustomPrototype.prototype = item;
			proto = new Cla$$CustomPrototype();
			proto.constructor = Cla$$CustomPrototype;
			
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
	cla$$.mixin = cla$$.include = function (target, Mixer, config) {
		config = config || {};
		Mixer.call(target, config);
	};
	cla$$.config = {
		require_new: true
	};
	module.exports = cla$$;
	
	cla$$.def = cla$$.define = function () {
		var config = this.def.getConfig(arguments);
		var $uper = config.$uper || cla$$Prototype,
		ctor = config.cla$$ || function () {};
		var proto = this.def.getPrototype($uper);
		
		var Cla$$ = function () {
			if (cla$$.config.require_new && this === window)
				throw "You must use the keyword `new` when calling a constructor function."
			
			return makeNew.call(Cla$$, ctor, arguments);
		}
		
		// Give cla$$ any static properties we want
		cla$$Configure(Cla$$, ctor, proto);
		
		// Add some helpful shortcuts to the prototype
		Cla$$Prototype.configure(Cla$$, proto);
		
		return Cla$$;
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
		if (typeof $uper === "function" && !this.isCla$$Prototype && !$uper.no_constructor) {
			initialize = false;
			proto = new $uper();
			initialize = true;
		} else proto = $uper;
		return proto;
	};
	
	function cla$$Configure(newCla$$, ctor, proto) {
		// Give cla$$ any static properties we want
		newCla$$.isCla$$ = true;
		newCla$$.prototype = ctor.prototype = proto;
		newCla$$.extend = extend;
	}
	
	function extend() {
		var config = cla$$.def.getConfig(arguments);
		config.$uper = this;
		return cla$$.def(config);
	}
	
	function makeNew(ctor, args) {
		var ret = new ctor();
		addShortcutsOnClassInit.call(ret, this.prototype, this);
		add$uperMethods(ret);
		
		if (initialize && ret.isCla$$Prototype && typeof ret.init === "function")
			ret.init.apply(ret, args);
		
		return ret;
	}
	
	function add$uperMethods(ownerObj) {
		for (var prop in ownerObj) {
			var fn = ownerObj[prop];
			
			if (!ownerObj.hasOwnProperty(prop)
				|| !(typeof fn === "function" && fnTest.test(fn))
				|| fn === ownerObj.constructor) continue;
			
			(function (fnName, fn) {
				this[fnName] = function (args) {
					var tmp = this.$uper;
					this.$uper = ownerObj.$[fnName];
					var ret = fn.apply(this, arguments);
					this.$uper = tmp;
					return ret;
				};
			}).call(ownerObj, prop, fn);
		}
	}
	
	function addShortcutsOnClassInit($uper, cla$$) {
	  this.$ = $uper;
      this.$$ = this.cla$$ = cla$$;
	}
	
})();

try {
  if (exports === window) {
    window.cla$$ = module.exports;
  }
} catch (e) {}