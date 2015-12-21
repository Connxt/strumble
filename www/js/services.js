(function () {
	angular.module("strumble.services", [])

	.factory("AccumulatedTime", function () {
		return {
			get: function () {
				var accumulatedTime = window.localStorage["strumble.accumulatedTime"];

				if(accumulatedTime) {
					return angular.fromJson(accumulatedTime);
				}

				return {
					units: 0,
					milliseconds: 0
				};
			},
			add: function (units, milliseconds) {
				var accumulatedTime = window.localStorage["strumble.accumulatedTime"];

				if(accumulatedTime) {
					accumulatedTime = angular.fromJson(accumulatedTime);
				}
				else {
					accumulatedTime = {
						units: 0,
						milliseconds: 0
					};
				}

				window.localStorage["strumble.accumulatedTime"] = angular.toJson({
					units: accumulatedTime.units + units,
					milliseconds: accumulatedTime.milliseconds + milliseconds
				});
			}
		}
	})

	.factory("TimeEntries", function () {
		return {
			getAll: function () {
				var timeEntries = window.localStorage["strumble.timeEntries"];
				if(timeEntries) {
					return angular.fromJson(timeEntries);
				}

				return [];
			},
			get: function (timeEntryId) {
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
			},
			add: function (timeEntryService) {
				var timeEntries = window.localStorage["strumble.timeEntries"],
					timeEntry = {};

				if(timeEntries) {
					timeEntries = angular.fromJson(timeEntries);
				}
				else {
					timeEntries = [];
				}

				timeEntry = {
					id: new Date(),
					clientName: timeEntryService.clientName,
					matter: timeEntryService.matter,
					phase: timeEntryService.phase,
					narration: timeEntryService.narration,
					status: timeEntryService.status,
					units: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.getTime().units : timeEntryService.manualMode.units,
					milliseconds: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.milliseconds : timeEntryService.manualMode.getTime().getTotalMillis(),
					recipientEmails: timeEntryService.recipientEmails,
					dateSent: new Date()
				};

				timeEntries.push(timeEntry);
				window.localStorage["strumble.timeEntries"] = angular.toJson(timeEntries);
			}
		};
	})

	.factory("TimeEntryService", function ($interval, Settings) {
		var timer;

		return {
			isTimerMode: false,
			clientName: "",
			matter: "",
			phase: "",
			narration: "",
			manualMode: {
				units: 0,
				getTotalMillis: function () {
					return (((this.units * 1000) * 60) * Settings.minutesPerUnit);
				},
				getTime: function () {
					var hours,
						minutes,
						seconds,
						milliseconds;

					milliseconds = (((this.units * 1000) * 60) * Settings.minutesPerUnit);

					seconds = Math.floor(milliseconds / 1000);
					milliseconds = milliseconds % 1000;

					minutes = Math.floor(seconds / 60);
					seconds = seconds % 60;

					hours = Math.floor(minutes / 60);
					minutes = minutes % 60;

					return {
						units: this.units,
						hours: hours,
						minutes: minutes,
						seconds: seconds,
						milliseconds: milliseconds
					};
				}
			},
			timerMode: {
				isTimerPlaying: false,
				milliseconds: 0,
				getTotalMillis: function () {
					return this.milliseconds;
				},
				getTime: function () {
					var units,
						hours,
						minutes,
						seconds,
						milliseconds = this.milliseconds;

					seconds = Math.floor(milliseconds / 1000);
					milliseconds = milliseconds % 1000;

					minutes = Math.floor(seconds / 60);
					seconds = seconds % 60;

					if(this.milliseconds >= 1) {
						units = Math.floor(minutes / Settings.minutesPerUnit) + 1;
					}
					else {
						units = 0;
					}


					hours = Math.floor(minutes / 60);
					minutes = minutes % 60;

					return {
						units: units,
						hours: hours,
						minutes: minutes,
						seconds: seconds,
						milliseconds: milliseconds
					};
				},
				start: function () {
					var ctx = this;

					timer = $interval(function () {
						this.milliseconds += 100;
						console.log(ctx.getTime());
					}, 100);
				},
				pause: function () {
					$interval.cancel(timer);
				},
				clear: function () {
					this.milliseconds = 0;
				}
			}
		};
	})

	.factory("Settings", function () {

		return {
			get: function () {
				var settings = window.localStorage["strumble.settings"];
				if(settings) {
					return angular.fromJson(settings);
				}

				return {};
			},
			set: function (settings) {
				window.localStorage["strumble.settings"] = angular.toJson(settings);
			}
		}

		// var _minutesPerUnit = 6;

		// return {
		// 	getMinutesPerUnit: function () {
		// 		return _minutesPerUnit;
		// 	}
		// };
	})

	.factory("Email", function () {
		var self = this;
		var mailingPath = "http://strumble.connxt.net/mail_api/";

		return {
			send: function (timeEntryService) {
				var config = {
					headers: {
						"Content-Type": "text/plain"
					}
				};

				var timeEntry = {
					id: new Date(),
					clientName: timeEntryService.clientName,
					matter: timeEntryService.matter,
					phase: timeEntryService.phase,
					narration: timeEntryService.narration,
					status: timeEntryService.status,
					units: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.getTime().units : timeEntryService.manualMode.units,
					milliseconds: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.milliseconds : timeEntryService.manualMode.getTime().getTotalMillis(),
					recipientEmails: timeEntryService.recipientEmails,
					dateSent: new Date()
				};

				return $http.post(mailingPath, timeEntry, config);
			}
		};
	});
})();