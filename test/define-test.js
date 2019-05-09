const QUnit = require("steal-qunit");
const { define } = require("../can-define-class");

QUnit.module("define()");

QUnit.test("Can define stuff", function(assert) {
  class Faves extends define() {
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
