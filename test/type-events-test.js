"use strict";

const QUnit = require("steal-qunit");
const { mixinObject } = require("./helpers");

QUnit.module("can-observable-mixin Type events");

require("can-reflect-tests/observables/map-like/type/type")("Defined", function(){
	return class Type extends mixinObject() {};
});

require("can-reflect-tests/observables/map-like/instance/on-event-get-set-delete-key")("ObservableObject", function(){
	class Type extends mixinObject() {}

	return new Type();
});
