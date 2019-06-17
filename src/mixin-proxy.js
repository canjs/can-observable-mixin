const defineBehavior = require("./define");
const ObservationRecorder = require("can-observation-recorder");

const eventDispatcher = defineBehavior.make.set.eventDispatcher;
const inSetupSymbol = Symbol.for("can.initializing");

function proxyPrototype(Base) {
	const instances = new WeakSet();

	function LateDefined() {
		let inst = Reflect.construct(Base, arguments, new.target);
		instances.add(inst);
		return inst;
	}

	const underlyingPrototypeObject = Object.create(Base.prototype);

	const proxyHandlers = {
		get(target, key, receiver) {
			if (!this[inSetupSymbol] && typeof key !== "symbol") {
				ObservationRecorder.add(receiver, key);
			}
			return Reflect.get(target, key, receiver);
		},
		set(target, key, value, receiver) {
			// Symbols are not observable, so just set the value
			if (typeof key === "symbol") {
				Reflect.set(target, key, value, receiver);
				return true;
			}

			// We decided to punt on making the prototype observable, so anything
			// set on a prototype just gets set.
			if(key in target || !instances.has(receiver)) {
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

module.exports = proxyPrototype;
