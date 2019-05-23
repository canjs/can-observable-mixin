const addTypeEvents  = require("can-event-queue/type/type");

function mixinTypeEvents(Type) {
	let Child = class extends Type {};
	addTypeEvents(Child);
	return Child;
}

module.exports = mixinTypeEvents;
