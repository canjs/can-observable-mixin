const {mixinDefinedProxyObject} = require("../mixins");
const canReflect = require("can-reflect");

const DefineObject = mixinDefinedProxyObject();

QUnit.module("can-define-mixin - Proxy Objects");

QUnit.test("Can bind on properties not defined", function(assert) {
	class Favorites extends DefineObject {}

	let faves = new Favorites();

	canReflect.onKeyValue(faves, "food", function() {
		assert.ok(true);
	});

	faves.food = "pizza";
});
