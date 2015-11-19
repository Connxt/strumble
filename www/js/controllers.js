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

app.controller("TimerController", function ($scope, $rootScope, $state, $stateParams, $interval, APP_STATES, TimeEntries, Settings, CurrentTimeEntry) {
	var timer,
		settings = Settings.get();
	$rootScope.test = "asd";
	$scope.APP_STATES = APP_STATES;
	$scope.currentTimeEntry = CurrentTimeEntry.get();
	$scope.milliseconds = 0;

	$scope.$watch("currentTimeEntry", function (newValue, oldValue) {
		CurrentTimeEntry.set(newValue);
		$scope.currentTimeEntry = CurrentTimeEntry.get();
	}, true);

	$scope.$watch("currentTimeEntry.hours", function (newValue, oldValue) {
		$scope.currentTimeEntry.hours = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 99 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$scope.$watch("currentTimeEntry.minutes", function (newValue, oldValue) {
		$scope.currentTimeEntry.minutes = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 60 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$scope.$watch("currentTimeEntry.seconds", function (newValue, oldValue) {
		$scope.currentTimeEntry.seconds = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 60 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$scope.isPlaying = false;

	if($scope.currentTimeEntry.isTimerMode === undefined) {
		if(settings.timerModeAsDefault === undefined) {
			settings.timerModeAsDefault = false;
			Settings.set(settings);

			$scope.currentTimeEntry.isTimerMode = false;
		}
		else {
			$scope.currentTimeEntry.isTimerMode = settings.timerModeAsDefault;
		}
	}

	$scope.toggleMode = function () {
		if(!$scope.currentTimeEntry.isTimerMode) {
			$scope.isPlaying = true;
			$scope.toggleTimer($scope.isPlaying);
		}
	};

	$scope.toggleTimer = function (isPlaying) {
		if($scope.isPlaying) {
			$scope.isPlaying = false;
			$interval.cancel(timer);
		}
		else {
			$scope.isPlaying = true;

			timer = $interval(function () {
				$scope.milliseconds += 100;

				if($scope.milliseconds >= 1000) {
					$scope.currentTimeEntry.seconds++;
					$scope.milliseconds = 0;
				}

				if($scope.currentTimeEntry.seconds >= 60) {
					$scope.currentTimeEntry.minutes++;
					$scope.currentTimeEntry.seconds = 0;
				}

				if($scope.currentTimeEntry.minutes >= 60) {
					$scope.currentTimeEntry.hours++;
					$scope.currentTimeEntry.minutes = 0;
				}
			}, 100);
		}
	};

	$scope.resetTimer = function () {
		$scope.isPlaying = true;
		$scope.toggleTimer($scope.isPlaying);

		$scope.currentTimeEntry.hours = 0;
		$scope.currentTimeEntry.minutes = 0;
		$scope.currentTimeEntry.seconds = 0;
		$scope.milliseconds = 0;
	};
});

app.controller("MoreInfoController", function ($scope, $rootScope, CurrentTimeEntry) {
	$scope.currentTimeEntry = CurrentTimeEntry.get();

	$scope.$watch("currentTimeEntry", function (newValue, oldValue) {
		CurrentTimeEntry.set(newValue);
		$scope.currentTimeEntry = CurrentTimeEntry.get();
	}, true);
});

app.controller("SendController", function ($scope, $rootScope, $state, $ionicActionSheet, $ionicPopup, $ionicModal, APP_STATES, TIME_ENTRY_STATUSES, TimeEntries, CurrentTimeEntry, Settings) {
	$scope.currentTimeEntry = CurrentTimeEntry.get();

	$ionicModal.fromTemplateUrl("templates/main/preview.html", {
		scope: $scope,
		animation: "slide-in-up"
	}).then(function (modal) {
		$scope.previewModal = modal;
	});

	$scope.preview = function () {
		var settings = Settings.get(),
			errors = [],
			errorMessage = "";

		$scope.previewModal.show();
	};

	$scope.closePreviewModal = function () {
		$scope.previewModal.hide();
	};

	$scope.send = function (withPreview) {
		if(settings.recipientEmail === undefined) {
			errors.push("Recipient Email");
		}

		if(settings.myEmail === undefined || settings.myEmailPassword === undefined) {
			errors.push("My Email");
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
						$scope.currentTimeEntry.dateSent = Date();

						TimeEntries.add($scope.currentTimeEntry);

						$scope.currentTimeEntry = {};
						CurrentTimeEntry.clear();

						$scope.previewModal.hide();
						$state.go(APP_STATES.main);
					}

					return true;
				}
			});
		}
	};
});

app.controller("TimeEntryListController", function ($scope, $state, TimeEntries, TIME_ENTRY_STATUSES, APP_STATES) {
	$scope.timeEntries = TimeEntries.getAll();
	$scope.TIME_ENTRY_STATUSES = TIME_ENTRY_STATUSES;

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
	// $scope.tempSettings = {};
	// angular.copy($scope.settings, $scope.tempSettings);

	$scope.setRecipientEmail = function () {
		$ionicPopup.show({
			template: "<label class='item item-input'><input type='email' ng-model='tempSettings.recipientEmail' placeholder='sample_email@domain.com' autofocus/></label>",
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
				"</label>" +
				"<label class='item item-input'>" +
				"	<input type='password' ng-model='tempSettings.myEmailPassword' placeholder='Password'/>" +
				"</label>",
			title: "Enter Your Email Details",
			subTitle: "Make sure that your email address and password match",
			scope: $scope,
			buttons: [{
				text: "Cancel"
			}, {
				text: "Save",
				type: "button-positive",
				onTap: function (e) {
					if(! ($scope.tempSettings.myEmail && $scope.tempSettings.myEmailPassword)) {
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