"use strict";

const QUnit = require("steal-qunit");
const Defined = require("../can-define-class");

QUnit.module("can-define-class Type events");

require("can-reflect-tests/observables/map-like/type/type")("Defined", function(){
	return class Type extends Defined {};
});
