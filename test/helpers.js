const { hooks, makeDefineInstanceKey } = require("../define");

const mixinMapProps = require("../mixin-mapprops");
const mixinProxy = require("../mixin-proxy");
const mixinTypeEvents = require("../mixin-typeevents");

exports.mixinObject = function(Base = Object) {
	let ChildClass = class extends mixinProxy(Base) {
		constructor(props) {
			super(props);
			hooks.finalizeClass(this.constructor);
			hooks.initialize(this, props);
		}
	};

	ChildClass = mixinTypeEvents(mixinMapProps(ChildClass));
	makeDefineInstanceKey(ChildClass);

	return ChildClass;
};
