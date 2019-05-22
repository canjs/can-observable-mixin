const addDefinedProps = require("./define");
const { hooks, updateSchemaKeys, setup } = addDefinedProps;

const mixinMapProps = require("./mixin-mapprops");
const mixinTypeEvents = require("./mixin-typeevents");

function mixinDefine(Base = Object) {
	let ChildClass = class extends mixinProxy(Base) {
		constructor(props) {
			super(props);
			hooks.finalizeClass(this.constructor);
			hooks.initialize(this, props);
		}
	};

	ChildClass = mixinTypeEvents(mixinMapProps(ChildClass));
	addDefinedProps.makeDefineInstanceKey(ChildClass);

	return ChildClass;
}

module.exports = mixinDefine;
