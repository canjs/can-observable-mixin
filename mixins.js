const define = require("./define");
const mixinElement = require("./mixin-element");
const mixinMapProps = require("../mixin-mapprops");
const mixinProxy = require("./mixin-proxy");
const mixinTypeEvents = require("./mixin-typeevents");

exports.makeDefineInstanceKey = define.makeDefineInstanceKey;
exports.mixins = define.hooks;

exports.mixinElement = mixinElement;
exports.mixinMapProps = mixinMapProps;
exports.mixinProxy = mixinProxy;
exports.mixinTypeEvents = mixinTypeEvents;
