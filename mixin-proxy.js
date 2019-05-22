const defineBehavior = require("./define");

function isArrayType(Type) {
	return Type === Array || Array.isPrototypeOf(Type);
}

function proxyPrototype(Base) {
	function LateDefined() {
		let inst = Reflect.construct(Base, arguments, new.target);
		return inst;
	}

	const proxyHandlers = {
		get(target, key, receiver) {
			// TODO ObservationRecorder.add()
			return Reflect.get(target, key, receiver);
		},
		set(target, key, value, receiver) {
			// TODO I know this is wrong but i'm just doing it this way for now, ok?
			if(key in target) {
				Reflect.set(target, key, value);
			} else if (typeof key === "symbol") {
				Reflect.set(target, key, value, receiver);
			} else {
				defineBehavior.expando(receiver, key, value);
			}

			return true;
		}
	};

	LateDefined.prototype = new Proxy(Object.create(Base.prototype), proxyHandlers);

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
