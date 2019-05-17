const QUnit = require("steal-qunit");
const { mixinDefine } = require("../can-define-class");

QUnit.module("can-define-class - define()");

const supportsCustomElements = "customElements" in window;

QUnit.test("Can define stuff", function(assert) {
  class Faves extends mixinDefine() {
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

QUnit.test("Does not throw if no define is provided", function(assert) {
	class Faves extends mixinDefine() {}
	const faves = new Faves();
	assert.ok(true, "Did not throw");
});

QUnit.test("Stuff is defined in constructor for non-element classes", function(assert) {
  class Faves extends mixinDefine(Object) {
    static get define() {
      return {
		  color: {
			  default: "blue"
		  }
      };
    }

	constructor() {
		super();
		assert.equal(this.color, "blue", "color exists after constructor");
	}
  }

  let faves = new Faves();
});

if (supportsCustomElements) {
	QUnit.test("Stuff is defined in connectedCallback for custom elements", function(assert) {
	  class Faves extends mixinDefine(HTMLElement) {
		static get define() {
		  return {
			  color: {
				  default: "blue"
			  }
		  };
		}

		constructor() {
			super();
			assert.equal(this.color, undefined, "color does not exist after constructor");
		}

		connectedCallback() {
			super.connectedCallback();
			assert.equal(this.color, "blue", "color does not exist after constructor");
		}
	  }
	  customElements.define("can-defined-el", Faves);

	  let faves = new Faves();
	  faves.connectedCallback();
	});

	QUnit.test("Stuff is not redefined in connectedCallback for classes that extend Elements but call setup themselves", function(assert) {
	  class Faves extends mixinDefine(HTMLElement) {
		  static get define() {
			  return {
				  color: {
					  default: "blue"
				  }
			  };
		  }

		constructor() {
			super();
			assert.equal(this.color, undefined, "color does not exist after constructor");
			this.setup();
			assert.equal(this.color, "blue", "color exists after setup is called manually");
			this.color = "red";
			assert.equal(this.color, "red", "color is changed to red");
		}

		connectedCallback() {
			super.connectedCallback();
			assert.equal(this.color, "red", "color is not redefined");
		}
	  }
	  customElements.define("can-manually-defined-el", Faves);

	  let faves = new Faves();
	  faves.connectedCallback();
	});
}
