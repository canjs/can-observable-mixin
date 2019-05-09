var QUnit = require("steal-qunit");
var DefineClass = require("./can-define-class");

QUnit.module("can-define-class");

QUnit.test("basics", function(assert) {
  class Obj extends DefineClass {}

  var obj = new Obj();
  assert.ok(obj instanceof Obj);
});
