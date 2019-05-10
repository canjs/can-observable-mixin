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
		static define = {
			color: {}
		}
	}

	let faves = new Faves();
	faves.listenTo("color", function() {
		assert.equal(faves.color, "red", "got  the change");
	});

	faves.color = "red";
});
