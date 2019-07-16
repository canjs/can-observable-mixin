"use strict";

const QUnit = require("steal-qunit");
const { mixinObject } = require("./helpers");

QUnit.module("can-observable-mixin Type events");

require("can-reflect-tests/observables/map-like/type/type")("Defined", function(){
	return class Type extends mixinObject() {};
});
