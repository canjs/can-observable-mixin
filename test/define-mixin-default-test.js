const QUnit = require("steal-qunit");
const { mixinObject } = require("./helpers");

const DefineObject = mixinObject();

QUnit.test("Primitives can be provided as the default in the PropDefinition", function(assert) {
	class Person extends DefineObject {
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
	class Person extends DefineObject {
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

QUnit.test("Primitives provided as the default sets the type as strict", function(assert) {
	class Person extends DefineObject {
		static get define() {
			return {
				age: 13
			};
		}
	}

	let person = new Person();

	assert.equal(person.age, 13, "Set the value");

	try {
		person.age = "fourteen";
		assert.ok(false, "Should have thrown");
	} catch(e) {
		assert.ok(true, "Threw because its type number");
	}
});

QUnit.test("Extended DefineObjectes can be used to set the type", function(assert) {
	class One extends DefineObject {
	}

	class Two extends DefineObject {
		static get define() {
			return {
				one: One
			};
		}
	}

	let one = new One();
	let two = new Two({ one });

	assert.equal(two.one, one, "Able to pass the instance");

	try {
		new Two({ one: {} });
		assert.ok(false, "Should have thrown");
	} catch(e) {
		assert.ok(true, "Throws because it is a strict type");
	}
});

QUnit.test("Allow a default object to be provided by using a getter", function(assert) {
	class Thing extends DefineObject {
		static get define() {
			return {
				prop: {
					get default() {
						return { foo: "bar" };
					}
				}
			};
		}
	}

	let one = new Thing();
	let two = new Thing();

	assert.deepEqual(one.prop, { foo: "bar" }, "Sets the default");
	assert.notEqual(one.prop, two.prop, "Different instances");
});

QUnit.test("Functions can be provided as the default in the PropDefinition", function(assert) {
	assert.expect(3);

	class Person extends DefineObject {
		static get define() {
			return {
				getAge: {
					default() {
						return 13;
					}
				}
			};
		}
	}

	let person = new Person();

	assert.equal(person.getAge(), 13, "property is a function");

	person.getAge = function() { return 30; };
	assert.equal(person.getAge(), 30, "function can be overwritten");

	try {
		person.getAge = 50;
	} catch(e) {
		assert.ok(true, "setting property to a non-function throws an error");
	}
});

QUnit.test("Functions can be provided as the default as the property value", function(assert) {
	assert.expect(3);

	class Person extends DefineObject {
		static get define() {
			return {
				getAge() {
					return 13;
				}
			};
		}
	}

	let person = new Person();

	assert.equal(person.getAge(), 13, "property is a function");

	person.getAge = function() { return 30; };
	assert.equal(person.getAge(), 30, "function can be overwritten");

	try {
		person.getAge = 50;
	} catch(e) {
		assert.ok(true, "setting property to a non-function throws an error");
	}
});
