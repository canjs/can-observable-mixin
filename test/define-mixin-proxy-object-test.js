const { mixinObject } = require("./helpers");
const canReflect = require("can-reflect");
const ObservationRecorder = require("can-observation-recorder");

const DefineObject = mixinObject();

QUnit.module("can-define-mixin - Proxy Objects");

QUnit.test("Can bind on properties not defined", function(assert) {
	class Favorites extends DefineObject {}

	let faves = new Favorites();

	canReflect.onKeyValue(faves, "food", function() {
		assert.ok(true);
	});

	faves.food = "pizza";
});

QUnit.test("Can listen to changes when listening to undefined props", function(assert) {
	let map = new DefineObject();

	ObservationRecorder.start();
	map.first; // jshint ignore:line
	let records = ObservationRecorder.stop();
	let entries = Array.from(records.keyDependencies.get(map));

	assert.deepEqual(entries, ["first"], "How the right entries");
});
