const QUnit = require("steal-qunit");
const Defined = require("../can-define-class");
const canReflect = require("can-reflect");

QUnit.module("can-define-class - DefineClass");

QUnit.test("Can define stuff", function(assert) {
  class Faves extends Defined {
    static get define() {
      return {
		  color: {
			  default: "blue"
		  }
      };
    }
  }

  let faves = new Faves();
  assert.equal(faves.color, "blue", "Got the value");
});

QUnit.test("Changes are observed", function(assert) {
	class Faves extends Defined {
		static get define() {
			return {
				color: {
					default: "blue"
				}
			};
		}
	}

	let faves = new Faves();
	canReflect.onKeyValue(faves, "color", () => {
		assert.equal(faves.color, "red");
	});
	faves.color = "red";
});

QUnit.test("async(resolve) resolves async values", function(assert) {
	let done = assert.async();

	class Faves extends Defined {
		static get define() {
			return {
				age: {
					async(resolve, last = 1) {
						this.birthday.then(() => {
							resolve(last + 1);
						});
					}
				}
			}
		}

		get birthday() {
			return Promise.resolve();
		}
	}

	let faves = new Faves();
	canReflect.onKeyValue(faves, "age", value => {
		assert.equal(value, 2, "Age incremented");
		done();
	});
});

QUnit.test("listenTo to listen to property changes", function(assert) {
	class Faves extends Defined {
		static get define() {
			return {
				color: {}
			};
		}
	}

	let faves = new Faves();
	faves.listenTo("color", function() {
		assert.equal(faves.color, "red", "got  the change");
	});

	faves.color = "red";
});

QUnit.test("value(prop) can be used to resolve a property based on others", function(assert) {
	class Person extends Defined {
		static get define() {
			return {
				isBirthday: {
					default: false
				},
				age: {
					value({ listenTo, resolve }) {
						let current = 1;

						listenTo("isBirthday", isBirthday => {
							if(isBirthday) {
								resolve(current = current + 1);
							}
						});

						resolve(current);
					}
				}
			}
		}
	}

	let p = new Person();
	canReflect.onKeyValue(p, "age", function() {
		assert.equal(p.age, 2, "Now is two");
	});
	p.isBirthday = true;
});

QUnit.test("getSchema returns the schema", function(assert) {
	class Faves extends Defined {
		static get define() {
			return {
				age: {}
			}
		}
	}

	let schema = canReflect.getSchema(Faves);
	assert.deepEqual(Object.keys(schema.keys), ["age"], "has the schema");
});

QUnit.test("getSchema still works when further deriving", function(assert) {
	class Base extends Defined {}
	class Faves extends Base {
		static get define() {
			return {
				age: {}
			}
		}
	}

	let schema = canReflect.getSchema(Faves);
	assert.deepEqual(Object.keys(schema.keys), ["age"], "has the schema");
});

QUnit.test("Does not throw if no define is provided", function(assert) {
	class Faves extends Defined {}
	assert.ok(true, "Did not throw");
});

QUnit.test("JavaScript setters work", function(assert) {
	class Faves extends Defined {
		static get define() {
			return {};
		}
		set color(v) {
			return "blue";
		}
	}

	let faves = new Faves();
	faves.color = "red";
	assert.equal(faves.color, "blue", "Did not change");
});

// Note that this is not documented behavior so we can change it in the future if needed
// It's unlikely something someone would do on purpose anyways.
QUnit.test("Setters on the define override those on the prototype", function(assert) {
	class Faves extends Defined {
		static get define() {
			return {
				color: {
					enumerable: false,
					set(v) {
						return "green";
					}
				}
			};
		}
		set color(v) {
			return "blue";
		}
	}

	let faves = new Faves();
	faves.color = "red";
	assert.equal(faves.color, "green", "Changed to green");

	let props = [];
	for(let prop in faves) {
		props.push(prop);
	}
	assert.deepEqual(props, [], "Not enumerable too");
});

QUnit.test("set() can return a different value", function(assert) {
	class Faves extends Defined {
		static get define() {
			return {
				color: {
					set() {
						return "blue";
					}
				}
			}
		}
	}

	let faves = new Faves();
	faves.color = "red";
	assert.equal(faves.color, "blue", "Did not change");
});

QUnit.test("set(newVal, resolve) can async resolve a value", function(assert) {
	let done = assert.async();
	class Faves extends Defined {
		static get define() {
			return {
				color: {
					set(n, resolve) {
						setTimeout(() => resolve("green"), 10);
					}
				}
			}
		}
	}

	let faves = new Faves();
	canReflect.onKeyValue(faves, "color", () => {
		assert.equal(faves.color, "green", "Changed async");
		done();
	});
	faves.color = "red";
});

QUnit.test("Passing props into the constructor", function(assert) {
	class Person extends Defined {
		static get define() {
			return {
				age: {
					default: 1
				}
			};
		}
	}

	assert.equal(new Person().age, 1, "the default");
	assert.equal(new Person({ age: 2 }).age, 2, "can be passed as a prop");
});

QUnit.test("seal: false prevents the object from being sealed", function(assert) {
	class Thing extends Defined {
	  static get seal() {
		  return false;
	  }
	}

	let p = new Thing();
	p.set("expando", 11);

	canReflect.onKeyValue(p, "expando", () => {
		assert.equal(p.get("expando"), 15, "Not sealed");
	});
	p.set("expando", 15);
});

QUnit.test("enumerable: false prevents the property from being enumerable", function(assert) {
	class Thing extends Defined {
		static get define() {
			return {
				shouldEnumerate: {
					default: "foo"
				},
				shouldNotEnumerate: {
					default: "bar",
					enumerable: false
				}
			};
		}
	}

	let thing = new Thing();
	let enumerated = [];
	for(let prop in thing) {
		enumerated.push(prop);
	}
	assert.deepEqual(enumerated, ["shouldEnumerate"], "Only enumerable properties");
});

QUnit.test("canReflect.hasKey works", function(assert) {
	class Thing extends Defined {
		static get define() {
			return {
				derivedProp: {
					get: function() {
						if (this.prop) {
							return this.prop + " World";
						}
					}
				}
			}
		}
	}

	let thing = new Thing({ prop: "Hello" });

	let testCases = [
		{ method: "hasKey", prop: "prop", expected: true },
		{ method: "hasKey", prop: "derivedProp", expected: true }
	];

	testCases.forEach(function(test) {
		assert.equal(canReflect[test.method](thing, test.prop), test.expected,
			"canReflect." + test.method + "(thing, '" + test.prop + "') should be " + test.expected
		);
	});
});

QUnit.test("Primitives can be provided as the default in the PropDefinition", function(assert) {
	class Person extends Defined {
		static get define() {
			return {
				age: {
					default: 13
				},
				likesChocolate: {
					default: false
				},
				favoriteColor: {
					default: "green"
				}
			};
		}
	}

	let person = new Person();

	assert.equal(person.age, 13, "Number works");
	assert.equal(person.likesChocolate, false, "Boolean works");
	assert.equal(person.favoriteColor, "green", "Strings work");
});

QUnit.test("Primitives can be provided as the default as the property value", function(assert) {
	class Person extends Defined {
		static get define() {
			return {
				age: 13,
				likesChocolate: false,
				favoriteColor: "green"
			};
		}
	}

	let person = new Person();

	assert.equal(person.age, 13, "Number works");
	assert.equal(person.likesChocolate, false, "Boolean works");
	assert.equal(person.favoriteColor, "green", "Strings work");
});
