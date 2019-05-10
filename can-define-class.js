const addDefinedProps = require("./define");
const hasBeenDefinedSymbol = Symbol.for("can.hasBeenDefined");

function define(Base = Object) {
	class Definable extends Base {
		constructor() {
			super();

			if(!new.target[hasBeenDefinedSymbol]) {
				let prototypeObject = new.target.prototype;
				let defines = new.target.define;
				addDefinedProps(prototypeObject, defines);
				new.target[hasBeenDefinedSymbol] = true;
			}
		}
	}

	return Definable;
}

exports = module.exports = define();
exports.define = define;
