#cla$$
---

Classes in Javascript can be quite a struggle. We are all looking for that expressive syntax afforded us by some of the more "classical" languages. Well, Javascript is not "classical". However, we can take advantage of Javascript's prototypal nature while getting some sort of classical feel. It should be well organized, simple and fast. `cla$$` has just the thing: 

```javascript
var Person = cla$$.define(function () {
  // Automatically called each time the class is intantiated
  this.init = function (name, age) {
    this.name = name;
    this.age = age;
  }
});

var SuperPerson = cla$$.define({
  $uper: Person,
  cla$$: function () {
    this.init = function (name, age, power) {
      this.power = power;
      
      // This calls `$uper`'s init function. 
      // The `_` function is simply a shortcut for `this.$uper.init.apply(this, arguments);`
      this.$uper.init._(arguments);
    }
  }
});

var jim = Person._new_("Jim Flannagan", 43);
var superMan = SuperPerson._new_("Clark Kent", Infinity);
```

##What just happened?

Let's take a moment to go over the syntax. Then we'll look into a few more shortcuts that will make you giggle.

When we defined person, we just slipped our constructor function into the `cla$$.define`:

```javascript
var Person = cla$$.define(function () { ... });
```

###The cla$$ prototype

This gives the class a base prototype that provides a couple of convenience methods that are a big part of what makes these classes so full of... well, money. So, let's explore those for a minute.

1.  `this._`
    This method is really awesome for creating natural private methods in our classes. Javascript has this bad habit of not
    binding `this` to private methods in a class (a private method's `this` is `window`. Yuck!) Here is an example of code that will only cause you worries:
  
    ```javascript
    function SomeClass() {
      this.action = "Go crazy";
      
      this.method = function () {
        return doSomething();
      };
      
      function doSomething() {
        return this.action;
      }
    }
    ```
    
    Besides the fact that this is a useless, contrived bit of code, the `this` variable will actually be bound to `window`
    (at least if you are in the browser) in the private function `doSomething`. That's funky! Instead, we could write that
    snippet this way:
    
    ```javascript
    var SomeClass = cla$$(function () {
      this.action = "Go crazy";
      
      this.method = function () {
        return doSomething();
      };
      
      var doSomething = this._(function () {
        return this.action;
      });
    });
    ```
    
    Fixed! `this` is now bound to the same `this` as in the class!
    
2.  `this.include` AKA `this.mixin`
    This method is great for adding `cla$$` functionality into the class when you extend classes or objects that were not
    created with `cla$$` in the first place. Of course, if your `$uper` object wasn't made with `cla$$`, you can't call it
    with `this.include` or `this.mixin` because they won't be in your prototype chain! But don't worry. You can also call
    it from the `cla$$` object itself.
    
    ```javascript
    var SomeClass = cla$$.define(function () {
      // Three ways to do the same thing:
      // 1.
      this.include(SomeMixer);
      // 2.
      this.mixin(SomeMixer); // These two are exactly the same
      // 3.
      // This is available even when the first two are not.
      // `cla$$.Prototype` is the right mixer to get all the normal class functionality in your class
      cla$$.mixin(this, cla$$.Prototype);
    });
    ```
    
    Wonderful! You might be wondering how to make your own `Mixer`s. Well, it's easy. They are just simple constructor
    functions, like this:
    
    ```javascript
    function SomeMixer(config) {
      this.someMethod = function () { ... };
      this.someProperty = "some data";
      this.otherStuff = config.otherStuff;
    }
    ```
    
    You can pass a config object as the last argument to any of the three `mixin`/`include` functions.
    
The `cla$$` prototype also has a couple of shortcuts. These will be available even if you don't have the `cla$$` prototype as part of your class because they are added to your prototype when the class is created.

1.  `$uper` AKA `$`
    This object lets you access the `$uper`, or prototype of your class from within the class. Useful for overloading
    methods. Notice in our first example we used `this.$uper.init._(arguments);` to call a method on the prototype that 
    had been overridden by the current classes method. We could also have used `this.$.init._(arguments);` to equal effect!
    
2.  `cla$$` AKA `$$`
    This object accesses the class itself. You can also use the `constructor` property for this (but why do that?). This
    is great to easily access static methods and properties of the class.
    
If you don't remember how many `$`'s to use for an object shortcut, just remember that `$` is for the `$uper` because `$uper` has one `$`, and `$$` is for `cla$$` because it has two `$`'s.

###Extending Cla$$es

Remember our `SuperPerson` class?

```javascript
var SuperPerson = cla$$.define({
  $uper: Person,
  cla$$: function () {
    this.init = function (name, age, power) {
      this.power = power;
      
      // This calls `$uper`'s init function. 
      // The `_` function is simply a shortcut for `this.$uper.init.apply(this, arguments);`
      this.$uper.init._(arguments);
    }
  }
});
```

Notice we set the prototype in the `$uper` property, and the actual `cla$$` function in the `cla$$` property. Simple enough. But what if we want to be even more succinct? Easy:

```javascript
var SuperPerson = Person.extend(function () {
    this.init = function (name, age, power) {
      this.power = power;
      
      // This calls `$uper`'s init function. 
      // The `_` function is simply a shortcut for `this.$uper.init.apply(this, arguments);`
      this.$uper.init._(arguments);
    }
  }
});
```

Ah, that's nicer!

####Extending non-`cla$$`es

You are not limited to `cla$$`es. You can extend anything you want, from native Javascript classes to objects to functions.

#####Native Javascript Classes

```javascript
var SuperArray = cla$$.define({
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
```

#####Objects and Functions

`cla$$` not only holds the `cla$$` prototype constructor and the `define` method, but it is also a functions that converts normal objects and functions into the sort of prototype that `cla$$` can use without funny things happening.
```javascript
var _1984 = cla$$.define({
  $uper: cla$$({
    type: "book",
    title: "1984"
    author: "Wish I. Kudremember"
  }),
  cla$$: function () { ... }
});
```

```javascript
var alrt = cla$$.define({
  $uper: cla$$(window.alert),
  cla$$: function () {
    this.msg = function (str) {
      this.$(str);
    };
  }
})
```

**Note**: You can actually extend objects without using the `cla$$` function. Using the `cla$$` function does a few convenient things to your object, though. 
1.  It makes an empty object with your object as the prototype. This is so that when you add things to the prototype, you
    don't mess with your object directly.
2.  It adds all the items from the `cla$$` prototype to the new object (skipping items of the same name on your original
    object). That way, you have all the convenience methods and shortcuts right off the bat.

**Another Note**: If you want to extend a function, then you really should use the `cla$$` function as described above. This is because `cla$$.define` will treat any function as a constructor function, unless it is first passed through `cla$$`. This will add the `cla$$` prototype methods directly to the function.

###Little extras

*   Into Ruby, are you? Use `def` instead of `define`:

    ```javascript
    var Person = cla$$.def(function () { ... });
    ```

*   Remember to call a class like this:
    
    ```javascript
    Person._new_();
    // or
    Person.make();
    ```
    
    instead of
    
    ```javascript
    new Person();
    ```
    
    The first two methods initialize the object for you.
    
##Direction

`cla$$` aims to be light, fast and strong. We will continue giving it features that increase its speed and ease of use. What would you like to see be added on to `cla$$`? Please let me know what you think, and feel free to send me pull requests!