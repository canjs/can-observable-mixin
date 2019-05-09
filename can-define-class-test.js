import QUnit from "steal-qunit";
import mixinDefineProperty from "./can-define-class";

QUnit.module("can-stache-define-element");

QUnit.test("basics", function(assert) {
  function Obj() {}
  Obj.define = {};
  mixinDefineProperty(Obj);

  var obj = new Obj();
  assert.ok(obj instanceof Obj);
});
