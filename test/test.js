require("./define-mixin-test");
require("./define-test");
require("./define-types-test");
require("./type-events-test");
require("./define-mixin-default-test");
require("./define-mixin-new-test");

// Proxy stuff
const supportsCustomElements = "customElements" in window;

require("./define-mixin-proxy-object-test");

if(supportsCustomElements) {
	require("./define-mixin-proxy-htmlelement-test");
}
