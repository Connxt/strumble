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

app.controller("TimerController", function ($scope, $state, $stateParams, $interval, APP_STATES, DEFAULT_SETTINGS, TIMER_LIMITS, Timer, TimeEntries, Settings, CurrentTimeEntry) {
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
		settings.myDetails = DEFAULT_SETTINGS.myDetails;
		settings.recipientEmails = DEFAULT_SETTINGS.recipientEmails;

		Settings.set(settings);
	}

	$scope.currentTimeEntry.isTimerMode = settings.timerModeAsDefault;

	$scope.$watch("currentTimeEntry.units", function (newValue, oldValue) {
		$scope.currentTimeEntry.units = (!newValue || newValue > TIMER_LIMITS.units || newValue < 0) ? "" : parseInt(newValue);
	});

	$scope.$watch("currentTimeEntry.hours", function (newValue, oldValue) {
		$scope.currentTimeEntry.hours = (!newValue || newValue > TIMER_LIMITS.hours || newValue < 0) ? "" : parseInt(newValue);
	});

	$scope.$watch("currentTimeEntry.minutes", function (newValue, oldValue) {
		$scope.currentTimeEntry.minutes = (!newValue || newValue > TIMER_LIMITS.minutes || newValue < 0) ? "" : parseInt(newValue);
	});

	$scope.$watch("currentTimeEntry.seconds", function (newValue, oldValue) {
		$scope.currentTimeEntry.seconds = (!newValue || newValue > TIMER_LIMITS.seconds || newValue < 0) ? "" : parseInt(newValue);
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
				if($scope.currentTimeEntry.milliseconds >= TIMER_LIMITS.milliseconds) {
					$scope.currentTimeEntry.seconds++;
					$scope.currentTimeEntry.milliseconds = 0;

					// tries to increment the units each second
					var hoursToMinutes = $scope.currentTimeEntry.hours * 60;
					var tempMinutes = hoursToMinutes + $scope.currentTimeEntry.minutes;
					
					$scope.currentTimeEntry.units = parseInt(tempMinutes / settings.minutesPerUnit) + 1;
				}

				// increments minutes
				if($scope.currentTimeEntry.seconds >= TIMER_LIMITS.seconds) {
					$scope.currentTimeEntry.minutes++;
					$scope.currentTimeEntry.seconds = 0;
				}

				// increments hours
				if($scope.currentTimeEntry.minutes >= TIMER_LIMITS.minutes) {
					$scope.currentTimeEntry.hours++;
					$scope.currentTimeEntry.minutes = 0;
				}

				if($scope.currentTimeEntry.units >= TIMER_LIMITS.units || $scope.currentTimeEntry.hours >= TIMER_LIMITS.hours) {
					$scope.timerService.isPlaying = false;
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

	// $scope.clientNames = [];
	// $scope.search = function () {
	// 	Search.searchClientName($scope.currentTimeEntry.clientName).then(function (matches) {
	// 		$scope.clientNames = matches;
	// 	});
	// };
});

app.controller("MoreInfoController", function ($scope, CurrentTimeEntry) {
	$scope.currentTimeEntry = CurrentTimeEntry;
});

app.controller("SendController", function ($scope, $state, $ionicActionSheet, $ionicPopup, $ionicModal, APP_STATES, TIME_ENTRY_STATUSES, TimeEntries, AccumulatedTime, CurrentTimeEntry, Settings, Email, Timer, fixedNumLengthFilter) {
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

		if(! (settings.myDetails.name && settings.myDetails.email)) {
			errors.push("My Details");
		}

		if(Object.keys(settings.recipientEmails[0]).length === 0) {
			errors.push("Recipient Emails");
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
						$scope.currentTimeEntry.sentAs = TIME_ENTRY_STATUSES.final;
					}
					else if(index == 1) {
						$scope.currentTimeEntry.sentAs = TIME_ENTRY_STATUSES.draft;
					}
					else if(index == 2) {
						$scope.preview();
					}

					if(index < 2) {
						$scope.currentTimeEntry.myDetails = settings.myDetails;
						$scope.currentTimeEntry.recipientEmails = settings.recipientEmails;
						$scope.currentTimeEntry.dateSent = new Date();

						Email.send($scope.currentTimeEntry).success(function (data, status, headers, config) {
							TimeEntries.add($scope.currentTimeEntry);
							AccumulatedTime.add({
								units: $scope.currentTimeEntry.units,
								hours: $scope.currentTimeEntry.hours,
								minutes: $scope.currentTimeEntry.minutes,
								seconds: $scope.currentTimeEntry.seconds,
							});
							
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

							$ionicPopup.alert({
								title: "Success!",
								template: "Time entry has been saved and sent successfully."
							});
						}).error(function (data, status, headers, config) {
							$ionicPopup.alert({
								title: "Sending Failed",
								template: "An unknown error occured. <p><i class='ion-ios-checkmark-empty'></i> Make sure you have a stable internet connection.</p>"
							});
						});
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

app.controller("SettingsController", function ($scope, $ionicPopup, Settings, TIMER_LIMITS) {
	$scope.settings = Settings.get();
	$scope.tempSettings = Settings.get();

	$scope.setMyDetails = function () {
		$scope.tempSettings = Settings.get();

		$ionicPopup.show({
			templateUrl: "templates/settings/set-my-details.html",
			title: "Enter Your Mailing Details",
			subTitle: "Please enter your correct information.",
			scope: $scope,
			buttons: [{
				text: "Cancel"
			}, {
				text: "Save",
				type: "button-positive",
				onTap: function (e) {
					if(! ($scope.tempSettings.myDetails.name && $scope.tempSettings.myDetails.email)) {
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

	$scope.setRecipientEmails = function () {
		$scope.tempSettings = Settings.get();
		
		$ionicPopup.show({
			templateUrl: "templates/settings/set-recipient-emails.html",
			title: "Enter Recipient Emails",
			subTitle: "Please enter valid email addresses",
			scope: $scope,
			buttons: [{
				text: "Cancel"
			}, {
				text: "Save",
				type: "button-positive",
				onTap: function (e) {
					var isValid = true;

					for(var i = 0; i < $scope.tempSettings.recipientEmails.length; i++) {
						console.log($scope.tempSettings.recipientEmails[i].value);
						if(!$scope.tempSettings.recipientEmails[i].value) {
							isValid = false;
							break;
						}
					}

					if(isValid) {
						return isValid;
					}
					else {
						e.preventDefault();
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

	$scope.addRecipientEmail = function () {
		if($scope.tempSettings.recipientEmails[$scope.tempSettings.recipientEmails.length - 1].value) {
			$scope.tempSettings.recipientEmails.push({
				value: null
			});
		}
	};

	$scope.removeRecipientEmail = function (index) {
		$scope.tempSettings.recipientEmails.splice(index, 1);
	};

	$scope.setDefaultMode = function () {
		Settings.set($scope.tempSettings);
		$scope.settings = Settings.get();
	};

	$scope.setMinutesPerUnit = function () {
		$ionicPopup.show({
			templateUrl: "templates/settings/set-minutes-per-unit.html",
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

	$scope.$watch("tempSettings.minutesPerUnit", function (newValue, oldValue) {
		$scope.tempSettings.minutesPerUnit = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > TIMER_LIMITS.minutes || newValue < 0) ? 0 : parseInt(newValue);
	});
});

app.controller("StatsController", function ($scope) {

});