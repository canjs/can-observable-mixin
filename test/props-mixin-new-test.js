const QUnit = require("steal-qunit");
const { mixinObject } = require("./helpers");

const DefineObject = mixinObject();

QUnit.test("Calling an extended DefineObject with undefined props when sealed", function(assert) {
	class Person extends DefineObject {
		static get seal() { return true; }
	}

	try {
		new Person({ name: "Matthew" });
		assert.ok(false, "Should not have allowed these undefined properties");
	} catch(e) {
		assert.ok(true, "Throw because undefined props were passed");
	}
});

QUnit.test("Calling an extended DefineObject with undefined props when unsealed", function(assert) {
	class Person extends DefineObject {
		static get seal() { return false; }
	}

	try {
		let p = new Person({ name: "Matthew" });
		assert.equal(p.name, "Matthew", "set the undefined property");
	} catch(e) {
		assert.ok(false, "Should have set these properties");
	}
});

QUnit.test("Calling new DefineObject does not interfere with extended types", function(assert) {
	new DefineObject();

	class Person extends DefineObject {
		static get props() {
			return {
				age: 5
			};
		}
	}

	let p = new Person();
	assert.equal(p.age, 5, "Defaults applied");
});
