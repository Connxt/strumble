(function () {
	angular.module("strumble.services", [])

	.factory("TimeEntries", function () {

	})

	.factory("TimeEntryService", function ($interval, Settings) {
		var timer;
		// var timer,
		// 	this.milliseconds = 0; // used only in timerMode

		return {
			isTimerMode: false,
			clientName: "",
			matter: "",
			phase: "",
			narration: "",
			manualMode: {
				units: 0,
				getTotalMillis: function () {
					return (((this.units * 1000) * 60) * Settings.getMinutesPerUnit());
				},
				getTime: function () {
					var hours,
						minutes,
						seconds,
						milliseconds;

					milliseconds = (((this.units * 1000) * 60) * Settings.getMinutesPerUnit());

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
						units = Math.floor(minutes / Settings.getMinutesPerUnit()) + 1;
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
		var _minutesPerUnit = 6;

		return {
			getMinutesPerUnit: function () {
				return _minutesPerUnit;
			}
		};
	})

	.factory("Email", function () {

	});
})();