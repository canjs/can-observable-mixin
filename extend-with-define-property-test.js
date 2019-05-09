var QUnit = require("steal-qunit");
var extendWithDefineProperty = require("./extend-with-define-property");

QUnit.module("can-define-class - extend-with-define-property");

QUnit.test("basics", function(assert) {
  var Obj = function Obj() {};
  Obj.define = {};
  Obj = extendWithDefineProperty(Obj);

  var obj = new Obj();
  assert.ok(obj instanceof Obj);
});
