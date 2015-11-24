app.controller("HeaderController", function ($scope, $state, $ionicPopover, $ionicHistory, APP_STATES) {
	$scope.APP_STATES = APP_STATES;

	$ionicPopover.fromTemplateUrl("templates/main/popover.html", {
		scope: $scope
	}).then(function (popover) {
		$scope.popover = popover;
	});

	$scope.openPopover = function ($event) {
		$scope.popover.show($event);
	};

	$scope.goTo = function (stateName) {
		$state.go(stateName);
		$scope.popover.hide();
	};

	$scope.goBack = function () {
		$ionicHistory.goBack();
	};

	$scope.$on("destroy", function () {
		$scope.popover.remove();
	});
});

app.controller("TimerController", function ($scope, $state, $stateParams, $interval, APP_STATES, DEFAULT_SETTINGS, Timer, TimeEntries, Settings, CurrentTimeEntry) {
	var timer,
		settings = Settings.get();

	$scope.APP_STATES = APP_STATES;
	$scope.currentTimeEntry = CurrentTimeEntry;
	$scope.currentTimeEntry.milliseconds = 0;
	$scope.isPlaying = false;
	$scope.timerService = Timer;

	if(Object.keys(settings).length === 0) {
		settings.timerModeAsDefault = DEFAULT_SETTINGS.timerModeAsDefault;
		settings.minutesPerUnit = DEFAULT_SETTINGS.minutesPerUnit;

		Settings.set(settings);
	}

	$scope.currentTimeEntry.isTimerMode = settings.timerModeAsDefault;

	$scope.$watch("currentTimeEntry.units", function (newValue, oldValue) {
		$scope.currentTimeEntry.units = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 99 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$scope.$watch("currentTimeEntry.hours", function (newValue, oldValue) {
		$scope.currentTimeEntry.hours = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 99 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$scope.$watch("currentTimeEntry.minutes", function (newValue, oldValue) {
		$scope.currentTimeEntry.minutes = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 60 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$scope.$watch("currentTimeEntry.seconds", function (newValue, oldValue) {
		$scope.currentTimeEntry.seconds = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 60 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$scope.$watch("timerService.isPlaying", function (newValue, oldValue) {
		// if the timer is playing
		if(!newValue) {
			$interval.cancel(timer);
		}
		// if the timer is not playing
		else {
			timer = $interval(function () {
				$scope.currentTimeEntry.milliseconds += 100;

				// increments seconds
				if($scope.currentTimeEntry.milliseconds >= 1000) {
					$scope.currentTimeEntry.seconds++;
					$scope.currentTimeEntry.milliseconds = 0;

					// tries to increment the units each second
					$scope.currentTimeEntry.units = ($scope.currentTimeEntry.minutes / settings.minutesPerUnit) + 1
				}

				// increments minutes
				if($scope.currentTimeEntry.seconds >= 60) {
					$scope.currentTimeEntry.minutes++;
					$scope.currentTimeEntry.seconds = 0;
				}

				// increments hours
				if($scope.currentTimeEntry.minutes >= 60) {
					$scope.currentTimeEntry.hours++;
					$scope.currentTimeEntry.minutes = 0;
				}
			}, 100);
		}

		$scope.timerService.isPlaying = newValue;
	});

	$scope.toggleMode = function () {
		if(!$scope.currentTimeEntry.isTimerMode) {
			$scope.timerService.isPlaying = false;
		}
	};

	$scope.toggleTimer = function () {
		if($scope.timerService.isPlaying) {
			$scope.timerService.isPlaying = false;
		}
		else {
			$scope.timerService.isPlaying = true;
		}
	};

	$scope.resetTimer = function () {
		$scope.isPlaying = true;
		$scope.timerService.isPlaying = false;

		$scope.currentTimeEntry.units = 0;
		$scope.currentTimeEntry.hours = 0;
		$scope.currentTimeEntry.minutes = 0;
		$scope.currentTimeEntry.seconds = 0;
		$scope.currentTimeEntry.milliseconds = 0;
	};
});

app.controller("MoreInfoController", function ($scope, CurrentTimeEntry) {
	$scope.currentTimeEntry = CurrentTimeEntry;
});

app.controller("SendController", function ($scope, $state, $ionicActionSheet, $ionicPopup, $ionicModal, APP_STATES, TIME_ENTRY_STATUSES, TimeEntries, AccumulatedTime, CurrentTimeEntry, Settings, Timer, fixedNumLengthFilter) {
	$scope.currentTimeEntry = CurrentTimeEntry;
	$scope.timerService = Timer;

	$ionicModal.fromTemplateUrl("templates/main/preview.html", {
		scope: $scope,
		animation: "slide-in-up"
	}).then(function (modal) {
		$scope.previewModal = modal;
	});

	$scope.preview = function () {
		$scope.previewModal.show();
	};

	$scope.closePreviewModal = function () {
		$scope.previewModal.hide();
	};

	$scope.send = function (withPreview) {
		$scope.timerService.isPlaying = false;

		var settings = Settings.get(),
			errors = [],
			errorMessage = "";

		if(settings.recipientEmail === undefined) {
			errors.push("Recipient Email");
		}

		if(errors.length >= 1) {
			for(var i = 0; i < errors.length; i++) {
				errorMessage += "<h5><i class='ion-ios-checkmark-empty'></i> " + errors[i] + "</h5>";
			}

			$ionicPopup.alert({
				title: "Error",
				subTitle: "Please go to the settings and set the following:",
				template: errorMessage
			});
		}
		else {
			var actionSheetButtons = [{
					text: "Send as final"
				}, {
					text: "Send as draft"
				}];

			if(withPreview) {
				actionSheetButtons.push({ text: "Preview" });
			}

			$ionicActionSheet.show({
				buttons: actionSheetButtons,
				titleText: "Sending Options",
				cancelText: "Cancel",
				buttonClicked: function (index) {
					var settings = Settings.get()

					if(index == 0) {
						$scope.currentTimeEntry.status = TIME_ENTRY_STATUSES.final;
					}
					else if(index == 1) {
						$scope.currentTimeEntry.status = TIME_ENTRY_STATUSES.draft;
					}
					else if(index == 2) {
						$scope.preview();
					}

					if(index < 2) {
						$scope.currentTimeEntry.recipientEmail = settings.recipientEmail;
						$scope.currentTimeEntry.dateSent = new Date();

						TimeEntries.add($scope.currentTimeEntry);
						AccumulatedTime.add({
							units: $scope.currentTimeEntry.units,
							hours: $scope.currentTimeEntry.hours,
							minutes: $scope.currentTimeEntry.minutes,
							seconds: $scope.currentTimeEntry.seconds,
						});

						// var timeEntry = TimeEntries.get(TimeEntries.getAll().length - 1);
						
						// var emailBody =
						// 	"<strong>Client Name: </strong>" + (timeEntry.clientName === undefined) ? "..." : timeEntry.clientName + "<br />" +
						// 	"<strong>Sent As: </strong>" + timeEntry.status + "<br />" +
						// 	"<strong>Date Sent: </strong>" + timeEntry.dateSent + "<br />" +
						// 	"<strong>Length: </strong>" + fixedNumLengthFilter(timeEntry.hours, 2) + ":" + fixedNumLengthFilter(timeEntry.minutes, 2) + ":" + fixedNumLengthFilter(timeEntry.seconds, 2) + "<br />" +
						// 	"<strong>Matter: </strong>" + (timeEntry.matter === undefined) ? "..." : timeEntry.matter + "<br />" +
						// 	"<strong>Phase: </strong>" + (timeEntry.phase === undefined) ? "..." : timeEntry.phase + "<br />" +
						// 	"<strong>Narration: </strong>" + (timeEntry.narration === undefined) ? "..." : timeEntry.narration + "<br />";

						// window.plugin.email.open({
						// 	to: [settings.recipientEmail],
						// 	cc: [],
						// 	bcc: [],
						// 	attachments: [],
						// 	subject: timeEntry.clientName + " - " + timeEntry.status,
						// 	body: emailBody,
						// 	isHtml: true
						// }, function () {
						// 	console.log("email view dismissed");
						// }, this);
						
						// resets the CurrentTimeEntry
						CurrentTimeEntry.units = 0;
						CurrentTimeEntry.hours = 0;
						CurrentTimeEntry.minutes = 0;
						CurrentTimeEntry.seconds = 0;
						CurrentTimeEntry.milliseconds = 0;
						CurrentTimeEntry.clientName = "";
						CurrentTimeEntry.matter = "";
						CurrentTimeEntry.phase = "";
						CurrentTimeEntry.narration = "";

						delete CurrentTimeEntry.recipientEmail;
						delete CurrentTimeEntry.dateSent;

						$scope.previewModal.hide();
						$state.go(APP_STATES.main);
					}

					return true;
				}
			});
		}
	};
});

app.controller("TimeEntryListController", function ($scope, $state, TimeEntries, AccumulatedTime, TIME_ENTRY_STATUSES, APP_STATES) {
	$scope.timeEntries = TimeEntries.getAll();
	$scope.TIME_ENTRY_STATUSES = TIME_ENTRY_STATUSES;
	$scope.accumulatedTime = AccumulatedTime.get();

	$scope.showDetails = function (timeEntryId) {
		$state.go(APP_STATES.timeEntryDetails, { timeEntryId: timeEntryId });
	}
});

app.controller("TimeEntryDetailsController", function ($scope, $stateParams, TimeEntries, TIME_ENTRY_STATUSES) {
	$scope.timeEntry = TimeEntries.get($stateParams.timeEntryId);
	$scope.TIME_ENTRY_STATUSES = TIME_ENTRY_STATUSES;
});

app.controller("SettingsController", function ($scope, $ionicPopup, Settings) {
	$scope.settings = Settings.get();
	$scope.tempSettings = Settings.get();

	$scope.setRecipientEmail = function () {
		$ionicPopup.show({
			template: "<label class='item item-input'><input type='email' ng-model='tempSettings.recipientEmail' placeholder='sample_email@domain.com' ng-bind'focusMe' autofocus/></label>",
			title: "Enter Recipient Email",
			subTitle: "Please enter a valid email address",
			scope: $scope,
			buttons: [{
				text: "Cancel"
			}, {
				text: "Save",
				type: "button-positive",
				onTap: function (e) {
					if(!$scope.tempSettings.recipientEmail) {
						e.preventDefault();
					}
					else {
						return true;
					}
				}
			}]
		}).then(function (result) {
			if(result) {
				Settings.set($scope.tempSettings);
				$scope.settings = Settings.get();
			}
		});
	};

	$scope.setMyEmail = function () {
		$ionicPopup.show({
			template:
				"<label class='item item-input'>" +
				"	<input type='email' ng-model='tempSettings.myEmail' placeholder='sample_email@domain.com' autofocus/>" +
				"</label>",
			title: "Enter Your Email Address",
			subTitle: "Please enter a valid email address",
			scope: $scope,
			buttons: [{
				text: "Cancel"
			}, {
				text: "Save",
				type: "button-positive",
				onTap: function (e) {
					if(! $scope.tempSettings.myEmail) {
						e.preventDefault();
					}
					else {
						return true;
					}
				}
			}]
		}).then(function (result) {
			if(result) {
				Settings.set($scope.tempSettings);
				$scope.settings = Settings.get();
			}
		});
	};

	$scope.setDefaultMode = function () {
		Settings.set($scope.tempSettings);
		$scope.settings = Settings.get();
	};

	$scope.setMinutesPerUnit = function () {
		$ionicPopup.show({
			template: "<label class='item item-input'><input type='number' ng-model='tempSettings.minutesPerUnit' placeholder='0' autofocus/></label>",
			title: "Enter Minutes Per Unit",
			subTitle: "Maximum allowable value is 60",
			scope: $scope,
			buttons: [{
				text: "Cancel"
			}, {
				text: "Save",
				type: "button-positive",
				onTap: function (e) {
					if(!$scope.tempSettings.minutesPerUnit) {
						e.preventDefault();
					}
					else {
						return true;
					}
				}
			}]
		}).then(function (result) {
			if(result) {
				Settings.set($scope.tempSettings);
				$scope.settings = Settings.get();
			}
		});
	};
});

app.controller("StatsController", function ($scope) {

});