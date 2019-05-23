const defineBehavior = require("./define");
const mixinElement = require("./mixin-element");
const mixinMapProps = require("./mixin-mapprops");
const mixinProxy = require("./mixin-proxy");
const mixinTypeEvents = require("./mixin-typeevents");

exports.makeDefineInstanceKey = defineBehavior.makeDefineInstanceKey;
exports.mixins = defineBehavior.hooks;

exports.mixinElement = mixinElement;
exports.mixinMapProps = mixinMapProps;
exports.mixinProxy = mixinProxy;
exports.mixinTypeEvents = mixinTypeEvents;
