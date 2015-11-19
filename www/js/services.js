app.factory("TimeEntries", function () {
	var self = this,
		timeEntries = [{
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Draft",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Draft",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Draft",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}, {
			clientName: "Sample Client Name",
			matter: "Sample Matter Lorem ipsum dolor sit amet",
			phase: "Sample Phase",
			narration: "Sample Narration",
			hours: 3,
			minutes: 2,
			seconds: 1,
			sentAs: "Final",
			recipientEmail: "ryanskiefelipe@gmail.com"
		}];

	self.getAll = function () {
		return timeEntries;
	};

	self.get = function (index) {
		return timeEntries[index];
	}

	/**
	 * @param {String} timeEntry.clientName
	 * @param {String} timeEntry.matter
	 * @param {String} timeEntry.phase
	 * @param {String} timeEntry.narration
	 * @param {String} timeEntry.hours
	 * @param {String} timeEntry.minutes
	 * @param {String} timeEntry.seconds
	 * @param {String} timeEntry.sentAs
	 * @param {String} timeEntry.recipientEmail
	 * @param {date} timeEntry.dateSent
	 * @param {time} timeEntry.timeSent
	 */
	self.add = function (timeEntry) {
		timeEntries.push(timeEntry);
	};

	return self;
});

app.factory("CurrentTimeEntry", function () {
	var self = this,
		currentTimeEntry = {};

	self.get = function () {
		return currentTimeEntry;
	};

	/**
	 * @param {String} timeEntry.clientName
	 * @param {String} timeEntry.matter
	 * @param {String} timeEntry.phase
	 * @param {String} timeEntry.narration
	 * @param {boolean} timeEntry.isTimerMode
	 * @param {String} timeEntry.hours
	 * @param {String} timeEntry.minutes
	 * @param {String} timeEntry.seconds
	 */
	self.set = function (timeEntry) {
		currentTimeEntry = timeEntry;
	};

	return self;
});

app.factory("Settings", function () {
	var self = this;

	self.get = function () {
		var settings = window.localStorage["settings"];
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
		window.localStorage["settings"] = angular.toJson(settings);
	};

	return self;
});