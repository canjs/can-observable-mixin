const mixinDefine = require("./mixin-define");
const mixinTypeEvents = require("can-event-queue/type/type");
const mixinProxy = require("./mixin-proxy");

function mixinDefinedProxyObject(Base) {
	let DefinedObject = mixinProxy(mixinDefine(Base));
	mixinTypeEvents(DefinedObject);
	return DefinedObject;
}

exports.mixinDefinedProxyObject = mixinDefinedProxyObject;
exports.mixinDefine = mixinDefine;
exports.mixinProxy = mixinProxy;
exports.mixinTypeEvents = mixinTypeEvents;
