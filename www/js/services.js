(function () {
	angular.module("strumble.services", [])

	.factory("AccumulatedTime", function (TimeUtility) {
		return {
			get: function () {
				var tempAccumulatedTime = window.localStorage["strumble.accumulatedTime"];

				if(tempAccumulatedTime) {
					tempAccumulatedTime = angular.fromJson(tempAccumulatedTime);

					return {
						units: tempAccumulatedTime.units,
						totalMilliseconds: tempAccumulatedTime.totalMilliseconds,
						hours: TimeUtility.toTime(tempAccumulatedTime.totalMilliseconds).hours,
						minutes: TimeUtility.toTime(tempAccumulatedTime.totalMilliseconds).minutes,
						seconds: TimeUtility.toTime(tempAccumulatedTime.totalMilliseconds).seconds,
						milliseconds: TimeUtility.toTime(tempAccumulatedTime.totalMilliseconds).milliseconds
					};
				}

				return {
					units: 0,
					totalMilliseconds: 0,
					hours: 0,
					minutes: 0,
					seconds: 0,
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
						totalMilliseconds: 0
					};
				}

				window.localStorage["strumble.accumulatedTime"] = angular.toJson({
					units: accumulatedTime.units + units,
					totalMilliseconds: accumulatedTime.totalMilliseconds + milliseconds
				});
			}
		}
	})

	.factory("TimeEntries", function (AccumulatedTime, Email) {
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
				var timeEntries = window.localStorage["strumble.timeEntries"];

				if(timeEntries) {
					timeEntries = angular.fromJson(timeEntries);
				}
				else {
					timeEntries = [];
				}

				var timeEntry = {
					id: new Date().getTime(),
					clientName: timeEntryService.clientName,
					matter: timeEntryService.matter,
					phase: timeEntryService.phase,
					narration: timeEntryService.narration,
					sentAs: timeEntryService.sentAs,
					units: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.getTime().units : (!timeEntryService.manualMode.units || isNaN(timeEntryService.manualMode.units) || timeEntryService.manualMode.units < 1) ? 0 : parseInt(timeEntryService.manualMode.units),
					milliseconds: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.milliseconds : timeEntryService.manualMode.getTotalMillis(),
					recipientEmails: timeEntryService.recipientEmails,
					dateSent: new Date(),
					myDetails: timeEntryService.myDetails,
					recipientEmails: timeEntryService.recipientEmails
				};

				AccumulatedTime.add(timeEntry.units, timeEntry.milliseconds);

				timeEntries.push(timeEntry);
				window.localStorage["strumble.timeEntries"] = angular.toJson(timeEntries);
			}
		};
	})

	.factory("TimeEntryService", function ($interval, Settings, TimeUtility) {
		var timer;

		return {
			isTimerMode: false,
			clientName: "",
			matter: "",
			phase: "",
			narration: "",
			manualMode: {
				units: "",
				getTotalMillis: function () {
					var units;

					if(!this.units || isNaN(this.units)) {
						units = 0;
					}
					else {
						units = parseInt(this.units);
					}

					return (((units * 1000) * 60) * Settings.get().minutesPerUnit);
				},
				getTime: function () {
					var units,
						hours,
						minutes,
						seconds,
						milliseconds;

					if(!this.units || isNaN(this.units) || this.units < 1) {
						units = 0;
					}
					else {
						units = parseInt(this.units);
					}

					milliseconds = (((units * 1000) * 60) * Settings.get().minutesPerUnit);

					return {
						units: units,
						hours: TimeUtility.toTime(milliseconds).hours,
						minutes: TimeUtility.toTime(milliseconds).minutes,
						seconds: TimeUtility.toTime(milliseconds).seconds,
						milliseconds: TimeUtility.toTime(milliseconds).milliseconds
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

					if(this.milliseconds >= 1) {
						units = Math.floor(TimeUtility.toTime(milliseconds).minutes / Settings.get().minutesPerUnit) + 1;
					}
					else {
						units = 0;
					}

					return {
						units: units,
						hours: TimeUtility.toTime(milliseconds).hours,
						minutes: TimeUtility.toTime(milliseconds).minutes,
						seconds: TimeUtility.toTime(milliseconds).seconds,
						milliseconds: TimeUtility.toTime(milliseconds).milliseconds
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

	.factory("TimeUtility", function () {
		return {
			toTime: function (totalMilliseconds) {
				var milliseconds = totalMilliseconds;

				var seconds = Math.floor(milliseconds / 1000);
				milliseconds = milliseconds % 1000;

				var minutes = Math.floor(seconds / 60);
				seconds = seconds % 60;

				var hours = Math.floor(minutes / 60);
				minutes = minutes % 60;

				return {
					hours: hours,
					minutes: minutes,
					seconds: seconds,
					milliseconds: milliseconds
				};
			}
		}
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
	})

	.factory("Email", function ($http) {
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
					clientName: timeEntryService.clientName,
					matter: timeEntryService.matter,
					phase: timeEntryService.phase,
					narration: timeEntryService.narration,
					sentAs: timeEntryService.sentAs,
					units: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.getTime().units : (!timeEntryService.manualMode.units || isNaN(timeEntryService.manualMode.units) || timeEntryService.manualMode.units < 1) ? 0 : parseInt(timeEntryService.manualMode.units),
					hours: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.getTime().hours : timeEntryService.manualMode.getTime().hours,
					minutes: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.getTime().minutes : timeEntryService.manualMode.getTime().minutes,
					seconds: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.getTime().seconds : timeEntryService.manualMode.getTime().seconds,
					milliseconds: (timeEntryService.isTimerMode) ? timeEntryService.timerMode.milliseconds : timeEntryService.manualMode.getTotalMillis(),
					recipientEmails: timeEntryService.recipientEmails,
					dateSent: new Date(),
					myDetails: timeEntryService.myDetails,
					recipientEmails: timeEntryService.recipientEmails
				};

				return $http.post(mailingPath, timeEntry, config);
			}
		};
	});
})();