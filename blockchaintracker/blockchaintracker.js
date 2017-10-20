/* global Module */

/* Magic Mirror
 * Module: Blockchain Tracker
 *
 * By Nakima Solutions https://www.nakima.es
 * MIT Licensed.
 */

Module.register("blockchaintracker", {

	// Default module config.
	defaults: {
		apiBase: "https://api.coinmarketcap.com/v1/",
		fetchInterval: 1 * 60 * 1000, // Update every minute.
		initialLoadDelay: 0,
		retryDelay: 1 * 60 * 1000,
		currency: "bitcoin",
		convert: "EUR"
	},

	// Define required scripts.
	getStyles: function () {
		return ["style.css", "font-awesome.css"];
	},

	start: function() {
		Log.info("Starting module: " + this.name);

		this.cname = null;
		this.symbol = null;
		this.rank = null;
		this.price_usd = null;
		this.percent_change_1h = null;
		this.percent_change_24h = null;
		this.percent_change_7d = null;

		this.scheduleUpdate(this.config.initialLoadDelay);
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		var title = document.createElement("h4");
		title.innerHTML = this.cname + "&nbsp;" + this.symbol;
		wrapper.appendChild(title);

		var table = document.createElement("table");
		table.className = "small";
		var tr = document.createElement("tr");
		tr.innerHTML = "<td>Rank:</td><td>"+this.rank+"</td>";
		table.appendChild(tr);
		tr = document.createElement("tr");
		tr.innerHTML = "<td>Price USD:</td><td>"+this.price_usd+" $</td>";
		table.appendChild(tr);
		tr = document.createElement("tr");
		tr.innerHTML = "<td>Change last hour:</td><td>"+this.percent_change_1h+" %</td>";
		table.appendChild(tr);
		tr = document.createElement("tr");
		tr.innerHTML = "<td>Change last day:</td><td>"+this.percent_change_24h+" %</td>";
		table.appendChild(tr);
		tr = document.createElement("tr");
		tr.innerHTML = "<td>Change last week:</td><td>"+this.percent_change_7d+" %</td>";
		table.appendChild(tr);
		wrapper.appendChild(table);
		return wrapper;
	},

	processPrice: function(data) {
		data = data[0];
		this.cname = data.name;
		this.symbol = data.symbol;
		this.rank = data.rank;
		this.price_usd = data.price_usd;
		this.percent_change_1h = data.percent_change_1h;
		this.percent_change_24h = data.percent_change_24h;
		this.percent_change_7d = data.percent_change_7d;

		this.updateDom();
	},

	updatePrice: function() {

		var url = this.config.apiBase + "ticker/"+this.config.currency+'/?convert='+this.config.convert;
		var self = this;
		var retry = true;

		var priceRequest = new XMLHttpRequest();
		priceRequest.open("GET", url, true);
		priceRequest.onreadystatechange = function() {
			self.processPrice(JSON.parse(this.response));
		};
		priceRequest.send();
	},

	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.updatePrice();
		}, nextLoad);
	}
});
