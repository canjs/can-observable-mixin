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
