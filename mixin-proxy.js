const defineBehavior = require("./define");
const ObservationRecorder = require("can-observation-recorder");
const queues = require("can-queues");

const eventDispatcher = defineBehavior.make.set.eventDispatcher;

const inSetupSymbol = Symbol.for("can.initializing");

function isArrayType(Type) {
	return Type === Array || Array.isPrototypeOf(Type);
}

function proxyPrototype(Base) {
	function LateDefined() {
		let inst = Reflect.construct(Base, arguments, new.target);
		return inst;
	}

	const underlyingPrototypeObject = Object.create(Base.prototype);

	const proxyHandlers = {
		get(target, key, receiver) {
			if (!this[inSetupSymbol]) {
				ObservationRecorder.add(receiver, key);
			}
			return Reflect.get(target, key, receiver);
		},
		set(target, key, value, receiver) {
			// TODO I know this is wrong but i'm just doing it this way for now, ok?
			if(key in target || typeof key === "symbol") {
				let current = Reflect.get(target, key, receiver);
				Reflect.set(target, key, value, receiver);
				eventDispatcher(receiver, key, current, value);
			} else {
				defineBehavior.expando(receiver, key, value);
			}

			return true;
		}
	};

	LateDefined.prototype = new Proxy(underlyingPrototypeObject, proxyHandlers);
	return LateDefined;
}

function proxyArray() {
	throw new Error("Not yet implemented.");
}

function mixinProxy(Base = Object) {
	if(isArrayType(Base)) {
		return proxyArray(Base);
	} else {
		return proxyPrototype(Base);
	}
}

module.exports = mixinProxy;
