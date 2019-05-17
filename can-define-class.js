const ns = require("can-namespace");
const addDefinedProps = require("./define");
const { updateSchemaKeys, setup } = addDefinedProps;

const defineHelpers = require("./define-helpers");
const ObservationRecorder = require("can-observation-recorder");
const canLogDev = require("can-log/dev/dev");
const canReflect = require("can-reflect");
const queues = require("can-queues");
var addTypeEvents = require("can-event-queue/type/type");

const hasBeenDefinedSymbol = Symbol.for("can.hasBeenDefined");
const getSchemaSymbol = Symbol.for("can.getSchema");
const inSetupSymbol = Symbol.for("can.initializing");

function keysForDefinition(definitions) {
	var keys = [];
	for(var prop in definitions) {
		var definition = definitions[prop];
		if(typeof definition !== "object" || ("serialize" in definition ? !!definition.serialize : !definition.get)) {
			keys.push(prop);
		}
	}
	return keys;
}

function assign(source) {
	queues.batch.start();
	canReflect.assignMap(this, source || {});
	queues.batch.stop();
}
function update(source) {
	queues.batch.start();
	canReflect.updateMap(this, source || {});
	queues.batch.stop();
}
function assignDeep(source){
	queues.batch.start();
	// TODO: we should probably just throw an error instead of cleaning
	canReflect.assignDeepMap(this, source || {});
	queues.batch.stop();
}
function updateDeep(source){
	queues.batch.start();
	// TODO: we should probably just throw an error instead of cleaning
	canReflect.updateDeepMap(this, source || {});
	queues.batch.stop();
}
function setKeyValue(key, value) {
	var defined = defineHelpers.defineExpando(this, key, value);
	if(!defined) {
		this[key] = value;
	}
}
function getKeyValue(key) {
	var value = this[key];
	if(value !== undefined || key in this || Object.isSealed(this)) {
		return value;
	} else {
		ObservationRecorder.add(this, key);
		return this[key];
	}
}

function define(Base = Object) {
	class DefineClass extends Base {
		static _initDefines() {
			if(!this[hasBeenDefinedSymbol]) {
				let prototypeObject = this.prototype;
				// Won't be necessary if we do https://github.com/canjs/can-define-class/issues/46
				let defines = (this.define && this.define !== define) ? this.define : {};
				addDefinedProps(prototypeObject, defines);
				this[hasBeenDefinedSymbol] = true;
			}
		}

		static [getSchemaSymbol]() {
			this._initDefines();
			let def = this.prototype._define;
			let definitions = def ? def.definitions : {};
			let schema = {
				type: "map",
				identity: [],
				keys: {}
			};
			return updateSchemaKeys(schema, definitions);
		}

		constructor(props) {
			super();
			Object.defineProperty(this, inSetupSymbol, {
				configurable: true,
				enumerable: false,
				value: true,
				writable: true
			});
			new.target._initDefines();
			setup.call(this, props, new.target.seal);
			this[inSetupSymbol] = false;
		}

		get(prop){
			if(prop) {
				return getKeyValue.call(this, prop);
			} else {
				return canReflect.unwrap(this, Map);
			}
		}

		set(prop, value){
			if(typeof prop === "object") {
				//!steal-remove-start
				if(process.env.NODE_ENV !== 'production') {
					canLogDev.warn('can-define/map/map.prototype.set is deprecated; please use can-define/map/map.prototype.assign or can-define/map/map.prototype.update instead');
				}
				//!steal-remove-end
				if(value === true) {
					updateDeep.call(this, prop);
				} else {
					assignDeep.call(this, prop);
				}

			} else {
				setKeyValue.call(this, prop, value);
			}

			return this;
		}

		assignDeep(prop) {
			assignDeep.call(this, prop);
			return this;
		}

		updateDeep(prop) {
			updateDeep.call(this, prop);
			return this;
		}

		assign(prop) {
			assign.call(this, prop);
			return this;
		}

		update(prop) {
			update.call(this, prop);
			return this;
		}

		serialize () {
			return canReflect.serialize(this, Map);
		}

		deleteKey() {
			return defineHelpers.deleteKey.apply(this, arguments);
		}

		forEach(cb, thisarg, observe) {
			function forEach(list, cb, thisarg){
				return canReflect.eachKey(list, cb, thisarg);
			}

			if(observe === false) {
				ObservationRecorder.ignore(forEach)(this, cb, thisarg);
			} else {
				return forEach(this, cb, thisarg);
			}
		}

		static [Symbol.for("can.new")](...args) {
			return new this(...args);
		}

		get [Symbol.for("can.isMapLike")]() {
			return true;
		}

		get [Symbol.for("can.isListLike")]() {
			return false;
		}

		get [Symbol.for("can.isValueLike")]() {
			return false;
		}

		[Symbol.for("can.getKeyValue")](...args) {
			return getKeyValue.apply(this, args);
		}

		[Symbol.for("can.getOwnEnumerableKeys")]() {
			ObservationRecorder.add(this, 'can.keys');
			ObservationRecorder.add(Object.getPrototypeOf(this), 'can.keys');
			return keysForDefinition(this._define.definitions).concat(keysForDefinition(this._instanceDefinitions) );
		}

		[Symbol.for("can.serialize")](...args) {
			return defineHelpers.reflectSerialize.apply(this, args);
		}

		[Symbol.for("can.hasKey")](key) {
			return (key in this._define.definitions) || (this._instanceDefinitions !== undefined && key in this._instanceDefinitions);
		}
	}

	addDefinedProps.makeDefineInstanceKey(DefineClass);

	addTypeEvents(DefineClass);

	return DefineClass;
}

exports = module.exports = ns.DefineClass = define();
exports.define = define;
