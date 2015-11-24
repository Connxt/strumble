app.factory("TimeEntries", function () {
	var self = this;

	self.getAll = function () {
		var timeEntries = window.localStorage["strumble.timeEntries"];
		if(timeEntries) {
			return angular.fromJson(timeEntries);
		}

		return [];
	};

	self.get = function (index) {
		var timeEntries = window.localStorage["strumble.timeEntries"];
		if(timeEntries) {
			return angular.fromJson(timeEntries)[index];
		}

		return {};
	}

	/**
	 * @param {String} timeEntry.clientName
	 * @param {String} timeEntry.matter
	 * @param {String} timeEntry.phase
	 * @param {String} timeEntry.narration
	 * @param {String} timeEntry.hours
	 * @param {String} timeEntry.minutes
	 * @param {String} timeEntry.seconds
	 * @param {String} timeEntry.status
	 * @param {String} timeEntry.recipientEmail
	 * @param {date} timeEntry.dateSent
	 * @param {time} timeEntry.timeSent
	 */
	self.add = function (timeEntry) {
		var timeEntries = window.localStorage["strumble.timeEntries"];

		if(timeEntries) {
			timeEntries = angular.fromJson(timeEntries);
		}
		else {
			timeEntries = [];
		}

		timeEntries.push(timeEntry);
		window.localStorage["strumble.timeEntries"] = angular.toJson(timeEntries);
	};

	return self;
});

app.factory("CurrentTimeEntry", function () {
	return {};
});

app.factory("Settings", function () {
	var self = this;

	self.get = function () {
		var settings = window.localStorage["strumble.settings"];
		if(settings) {
			return angular.fromJson(settings);
		}

		return {};
	};

	/**
	 * @param {String} settings.recipientEmail
	 * @param {String} settings.myEmail
	 * @param {String} settings.myEmailPassword
	 * @param {boolean} settings.timerModeAsDefault
	 * @param {number} settings.minutesPerUnit
	 */
	self.set = function (settings) {
		window.localStorage["strumble.settings"] = angular.toJson(settings);
	};

	return self;
});