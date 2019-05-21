"use strict";

const QUnit = require("steal-qunit");
const { mixinDefinedProxyObject } = require("../mixins");

const DefineObject = mixinDefinedProxyObject();

QUnit.module("can-define-mixin Type events");

require("can-reflect-tests/observables/map-like/type/type")("Defined", function(){
	return class Type extends DefineObject {};
});
