const QUnit = require("steal-qunit");
const Defined = require("../can-define-class");
const canReflect = require("can-reflect");

QUnit.module("DefineClass");

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

QUnit.test("resolve(prop) can be used to resolve a property based on others", function(assert) {
	class Person extends Defined {
		static get define() {
			return {
				isBirthday: {
					default: false
				},
				age: {
					resolve({ listenTo, resolve }) {
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
