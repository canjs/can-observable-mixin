const defineBehavior = require("./define");
const ObservationRecorder = require("can-observation-recorder");

const eventDispatcher = defineBehavior.make.set.eventDispatcher;
const inSetupSymbol = Symbol.for("can.initializing");

// A bug in Safari means that __proto__ key is sent. This causes problems
// When addEventListener is called on a non-element.
// https://github.com/tc39/test262/pull/2203
let isProtoReadOnSuper = false;
(function(){
	if(typeof Proxy === "function") {
		let par = class { fn() { } };
		let base = new Proxy(par, {
			get(t, k, r) {
				if(k === "__proto__") { isProtoReadOnSuper = true; }
				return Reflect.get(t, k, r);
			}
		});
		let chi = class extends base { fn() { super.fn(); } };
		(new chi()).fn();
	}
})();

function proxyPrototype(Base) {
	const instances = new WeakSet();

	function LateDefined() {
		let inst = Reflect.construct(Base, arguments, new.target);
		instances.add(inst);
		return inst;
	}

	const underlyingPrototypeObject = Object.create(Base.prototype);

	const getHandler = isProtoReadOnSuper ?
		function(target, key, receiver) {
			if (!this[inSetupSymbol] && typeof key !== "symbol" && key !== "__proto__") {
				ObservationRecorder.add(receiver, key);
			}
			return Reflect.get(target, key, receiver);
		} :
		function(target, key, receiver) {
			if (!this[inSetupSymbol] && typeof key !== "symbol") {
				ObservationRecorder.add(receiver, key);
			}
			return Reflect.get(target, key, receiver);
		};

	const proxyHandlers = {
		get: getHandler,
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
