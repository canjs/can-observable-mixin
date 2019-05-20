const QUnit = require("steal-qunit");
const DefineClass = require("../can-define-class");

QUnit.test("Calling an extended DefineClass with undefined props when sealed", function(assert) {
	class Person extends DefineClass {
		static get seal() { return true }
	}

	try {
		let p = new Person({ name: "Matthew" });
		assert.ok(false, "Should not have allowed these undefined properties");
	} catch(e) {
		assert.ok(true, "Throw because undefined props were passed");
	}
});

QUnit.test("Calling an extended DefineClass with undefined props when unsealed", function(assert) {
	class Person extends DefineClass {
		static get seal() { return false }
	}

	try {
		let p = new Person({ name: "Matthew" });
		assert.equal(p.name, "Matthew", "set the undefined property");
	} catch(e) {
		assert.ok(false, "Should have set these properties");
	}
});
