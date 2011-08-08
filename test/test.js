// TEST

/*try {
  if (window == null) throw "";
  if (module.window == null) throw "";
  var cla$$ = require('../src/cla$$');
} catch (e) {
  var window = window;
  var module = {};
}*/

window.Person = cla$$.def(function () {
	this.init = function (config) {
		config = config || {};
		this.name = config.name;
		this.age = config.age;
		this.gender = config.gender;
		this.size = config.size;
	}
	
	this.stateAgeInDogYears = function () {
		return this.name + " is " + ageInDogYears() + " years old in dog years.";
	};
	
	var ageInDogYears = this._(function () {
		return this.age * 3;
	});
});

window.jim = new window.Person({
	name: "Jim",
	age: 23,
	gender: "Male",
	size: "Somewhat large"
});

window.SuperHero = window.Person.extend(function () {
	this.init = function (config) {
		//debugger;
		config = config || {};
		
		this.powers = config.powers;
		
		for (var i=0, len=this.powers.length; i<len; i++) {
			(function (power) {
				this[power] = function () { return this.name + " excersized " + (this.gender === "Male" ? "his" : "her") + " power of " + power + "."; };
			}).call(this, this.powers[i]);
		}
		
		this.$uper(config);
	};
	
	this.fight = function () {
	
		return this.name + " kapowed!";
	};
});

window.superMan = new window.SuperHero({
	name: "Clark Kent",
	age: Infinity,
	gender: "Male",
	size: "Truck",
	powers: ["lazerVision", "flight", "superStrength"]
});

window.GreekGod = window.SuperHero.extend(function () {
  this.init = function (config) {
    config = config || {};
    config.age = Infinity;
    
    this.residence = "Mount Olympus";
    
    this.$uper(config);
  };
});

window.zeuss = new window.GreekGod({name: "Zeuss", size: "Quite large", gender: "Male", powers: ["lightning"]});

window.A = cla$$.define({
	$uper: Array,
	cla$$: function () {
		cla$$.mixin(this, cla$$.Prototype);
		
		this.init = function () {
			this.pushFromArray(arguments);
		};
		
		this.pushFromArray = function (arr) {
			this.push.apply(this, arr);
		};
		
		this.at = function (i) {
			var indx;
			if (i < 0) indx = this.length + i;
			else indx = i;
			return this[indx];
		};
		
		this.last = function () {
			return this.at(-1);
		};
	}
});

window.Range = cla$$.def({
	$uper: window.A,
	cla$$: function () {
		this.init = function () {
			var config = getInitConfig(arguments);
			if (config.base) this.pushFromArray(config.base);
			this.startPoint = config.from || null;
			this.endPoint = config.to || Infinity;
			this.process = config.process || function (i) { return i+1 };
			
			if (this.startPoint || this.length === 0)
				this.push(this.startPoint || 0);
			
			if (config.makeAll) this.all();
		};
		
		var getInitConfig = this._(function (args) {
			var arg0 = args[0];
			var arg1 = args[1];
			
			if (typeof arg0 === "number") {
				return { from: arg0, to: arg1, makeAll: true };
			} else {
				return arg0 || {};
			}
		});
		
		this.next = function (times) {
			times = times || 1
			var next;
			for (var i=0; i<times; i++) {
				next = this.process(this.last());
				if (next <= this.endPoint) {
					this.push(next);
				} else if (isNaN(next)) {
					throw "Bad processor: NaN result.";
				} else throw "Endpoint reached.";
			}
			return next;
		};
		
		this.all = function (endPoint) {
			var clear = true,
			ret,
			oldEndPoint = this.endPoint;
			
			this.endPoint = endPoint || oldEndPoint;
			
			if (this.endPoint === Infinity)
				throw "Cannot get all entries when endPoint is Infinity.";
			
			while (clear) {
				try {
					ret = this.next();
				} catch (e) {
					clear = false;
				}
			}
			
			this.endPoint = oldEndPoint;
			return ret;
		};
	}
});

function range(from, to) {
	return new window.Range(from, to);
}
window.range = range;

window.fib = new window.Range({
  base: [0,1],
  process: function () { return this.at(-1) + this.at(-2) }
});

var book1984Proto;
var _1984 = cla$$.define({
  $uper: cla$$(book1984Proto = {
    type: "book",
    title: "1984",
    author: "Wish I. Kudremember"
  })
});

var firstCopyOf1984 = new _1984();

var alrt = new (cla$$.def({
  $uper: cla$$(function (msg) { alert(msg) }),
  cla$$: function () {
    this.msg = function (str) {
	  this.$(str);
	}
  }
}))();