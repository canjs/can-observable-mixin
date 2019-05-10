const addDefinedProps = require("./define");
const { updateSchemaKeys } = addDefinedProps;

const hasBeenDefinedSymbol = Symbol.for("can.hasBeenDefined");
const getSchemaSymbol = Symbol.for("can.getSchema");

function define(Base = Object) {
	class Definable extends Base {
		static _initDefines() {
			if(!this[hasBeenDefinedSymbol]) {
				let prototypeObject = this.prototype;
				let defines = this.define;
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

		constructor() {
			super();
			new.target._initDefines();
		}
	}

	return Definable;
}

exports = module.exports = define();
exports.define = define;
