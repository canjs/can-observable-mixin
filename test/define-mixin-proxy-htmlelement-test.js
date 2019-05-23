const {mixinElement} = require("../src/mixins");
const canReflect = require("can-reflect");

const supportsCustomElements = "customElements" in window;

if(supportsCustomElements) {
	QUnit.module("can-define-mixin - Proxy HTMLElement");

	QUnit.test("Can bind on properties not defined", function(assert) {
		const Base = mixinElement(HTMLElement);
		class Favorites extends Base {}

		customElements.define("my-favorites", Favorites);

		let faves = new Favorites();
		faves.connectedCallback();

		canReflect.onKeyValue(faves, "food", function() {
			assert.ok(true);
		});


		faves.food = "pizza";
	});

	QUnit.test("Can have functions on the prototype", function(assert) {
		const Base = mixinElement(HTMLElement);
		class Favorites extends Base {
			listFavorites() {

			}
		}

		customElements.define("my-favorites2", Favorites);

		let f1 = new Favorites();
		let f2 = new Favorites();

		assert.equal(typeof f1.listFavorites, "function", "It is a function");
		assert.equal(f1.listFavorites, f2.listFavorites,
			"Share the same function instance because it's on the prototype");

		assert.equal(Favorites.prototype.listFavorites, f1.listFavorites, "It is really on the prototype");
	});

	QUnit.test("Can have functions on the derived classes", function(assert) {
		const Base = mixinElement(HTMLElement);
		class One extends Base {}
		class Two extends One {
			aFunction() {}
		}

		customElements.define("my-two1", Two);

		let two = new Two();
		let two2 = new Two();

		assert.equal(typeof two.aFunction, "function", "It is a function");
		assert.equal(two.aFunction, two2.aFunction,
			"Share the same function instance because it's on the prototype");
	});

	QUnit.test("Can set a property of HTMLElement on the instance", function(assert) {
		const Base = mixinElement(HTMLElement);

		class Instance extends Base {}

		customElements.define("my-instance", Instance);

		let onclick = function(){};
		let instance = new Instance();
		instance.connectedCallback();
		instance.onclick = onclick;

		assert.equal(instance.onclick, onclick, "The onclick is there");
		assert.equal(document.createElement("button").onclick, null, "Didn't mess with the HTMLElement's onclick");

		canReflect.onKeyValue(instance, "onclick", function(newValue) {
			assert.equal(newValue, newonclick, "Changed to the new value");
		});

		instance.onclick;

		var newonclick = function(){};
		instance.onclick = newonclick;
	});
}
