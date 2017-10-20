/* global Module */

/* Magic Mirror
 * Module: Nakima
 *
 * By Nakima Solutions https://www.nakima.es
 * MIT Licensed.
 */

Module.register("nakima", {

	// Default module config.
	defaults: {
		imgsrc: "modules/nakima/public/nakimag.png"
	},

	getStyles: function() {
		return [this.file('style.css')]
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("img");
		wrapper.height = 500;
		wrapper.src = this.config.imgsrc;
		return wrapper;
	}
});
