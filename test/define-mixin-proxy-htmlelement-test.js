const {mixinDefinedProxyObject} = require("../mixins");
const canReflect = require("can-reflect");

QUnit.module("can-define-mixin - Proxy HTMLElement");

QUnit.test("Can bind on properties not defined", function(assert) {
	const Base = mixinDefinedProxyObject(HTMLElement);
	class Favorites extends Base {}

	customElements.define("my-favorites", Favorites);

	let faves = new Favorites();
	faves.connectedCallback();

	canReflect.onKeyValue(faves, "food", function() {
		assert.ok(true);
	});

	faves.food = "pizza";
});
