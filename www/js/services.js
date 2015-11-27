app.factory("AccumulatedTime", function () {
	var self = this;

	self.get = function () {
		var accumulatedTime = window.localStorage["strumble.accumulatedTime"];

		if(accumulatedTime) {
			return angular.fromJson(accumulatedTime);
		}

		return {
			units: 0,
			hours: 0,
			minutes: 0,
			seconds: 0
		};
	};

	/**
	 * @param {number} accumulatedTime.units
	 * @param {number} accumulatedTime.hours
	 * @param {number} accumulatedTime.minutes
	 * @param {number} accumulatedTime.seconds
	 */
	self.add = function (currentAccumulatedTime) {
		var tempAccumulatedTime = window.localStorage["strumble.accumulatedTime"],
			accumulatedTime = {};

		if(tempAccumulatedTime) {
			tempAccumulatedTime = angular.fromJson(tempAccumulatedTime);
		}
		else {
			tempAccumulatedTime = {
				units: 0,
				hours: 0,
				minutes: 0,
				seconds: 0
			};
		}

		accumulatedTime = {
			units: tempAccumulatedTime.units + currentAccumulatedTime.units,
			hours: tempAccumulatedTime.hours + currentAccumulatedTime.hours,
			minutes: tempAccumulatedTime.minutes + currentAccumulatedTime.minutes,
			seconds: tempAccumulatedTime.seconds + currentAccumulatedTime.seconds,
		};

		if(accumulatedTime.seconds >= 60) {
			accumulatedTime.seconds -= 60;
			accumulatedTime.minutes += 1;
		}

		if(accumulatedTime.minutes >= 60) {
			accumulatedTime.minutes -= 60;
			accumulatedTime.hours += 1;
		}

		window.localStorage["strumble.accumulatedTime"] = angular.toJson(accumulatedTime);
	};

	return self;
});

app.factory("TimeEntries", function () {
	var self = this;

	self.getAll = function () {
		var timeEntries = window.localStorage["strumble.timeEntries"];
		if(timeEntries) {
			return angular.fromJson(timeEntries);
		}

		return [];
	};

	self.get = function (timeEntryId) {
		var timeEntries = angular.fromJson(window.localStorage["strumble.timeEntries"]),
			timeEntry = {};
		
		if(timeEntries) {
			for(var i = 0; i < timeEntries.length; i++) {
				if(timeEntries[i].id == timeEntryId) {
					timeEntry = timeEntries[i];
					break;
				}
			}
		}

		return timeEntry;
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

app.factory("CurrentTimeEntry", function () {
	return {};
});

app.factory("Timer", function () {
	return {
		isPlaying: false
	};
});

app.factory("Email", function ($http) {
	var self = this;
	var apiEndPoint = "http://strumble.connxt.net/mail_api/";

	self.send = function (timeEntryData) {
		var config = {
			headers: {
				"Content-Type": "text/plain"
			}
		};

		return $http.post(apiEndPoint, timeEntryData, config);
	};

	return self;
});