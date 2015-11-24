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

app.controller("TimerController", function ($scope, $rootScope, $state, $stateParams, $interval, APP_STATES, DEFAULT_SETTINGS, TimeEntries, Settings, CurrentTimeEntry) {
	var timer,
		settings = Settings.get();

	$scope.APP_STATES = APP_STATES;
	$scope.milliseconds = 0;
	$rootScope.currentTimeEntry = CurrentTimeEntry.get();

	$rootScope.$watch("currentTimeEntry", function (newValue, oldValue) {
		CurrentTimeEntry.set(newValue);
		$rootScope.currentTimeEntry = CurrentTimeEntry.get();
	}, true);

	$rootScope.$watch("currentTimeEntry.units", function (newValue, oldValue) {
		$rootScope.currentTimeEntry.units = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 99 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$rootScope.$watch("currentTimeEntry.hours", function (newValue, oldValue) {
		$rootScope.currentTimeEntry.hours = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 99 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$rootScope.$watch("currentTimeEntry.minutes", function (newValue, oldValue) {
		$rootScope.currentTimeEntry.minutes = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 60 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$rootScope.$watch("currentTimeEntry.seconds", function (newValue, oldValue) {
		$rootScope.currentTimeEntry.seconds = (newValue === undefined || newValue === null || isNaN(newValue) || newValue > 60 || newValue < 0) ? 0 : parseInt(newValue);
	});

	$scope.isPlaying = false;

	console.log($rootScope.currentTimeEntry);
	console.log(settings);

	if(Object.keys(settings).length === 0) {
		settings.timerModeAsDefault = DEFAULT_SETTINGS.timerModeAsDefault;
		settings.minutesPerUnit = DEFAULT_SETTINGS.minutesPerUnit;

		Settings.set(settings);
	}

	$rootScope.currentTimeEntry.isTimerMode = settings.timerModeAsDefault;

	// if($rootScope.currentTimeEntry.isTimerMode === undefined) {
	// 	if(settings.timerModeAsDefault === undefined) {
	// 		settings.timerModeAsDefault = false;
	// 		Settings.set(settings);

	// 		$rootScope.currentTimeEntry.isTimerMode = false;
	// 	}
	// 	else {
	// 		$rootScope.currentTimeEntry.isTimerMode = settings.timerModeAsDefault;
	// 	}
	// }

	$scope.toggleMode = function () {
		if(!$rootScope.currentTimeEntry.isTimerMode) {
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
					$rootScope.currentTimeEntry.seconds++;
					$scope.milliseconds = 0;
				}

				if($rootScope.currentTimeEntry.seconds >= 60) {
					$rootScope.currentTimeEntry.minutes++;
					$rootScope.currentTimeEntry.seconds = 0;
				}

				if($rootScope.currentTimeEntry.minutes >= 60) {
					$rootScope.currentTimeEntry.hours++;
					$rootScope.currentTimeEntry.minutes = 0;
				}
			}, 100);
		}
	};

	$scope.resetTimer = function () {
		$scope.isPlaying = true;
		$scope.toggleTimer($scope.isPlaying);

		$rootScope.currentTimeEntry.hours = 0;
		$rootScope.currentTimeEntry.minutes = 0;
		$rootScope.currentTimeEntry.seconds = 0;
		$scope.milliseconds = 0;
	};
});

app.controller("MoreInfoController", function ($scope, $rootScope, CurrentTimeEntry) {
	$rootScope.currentTimeEntry = CurrentTimeEntry.get();

	// $rootScope.$watch("currentTimeEntry", function (newValue, oldValue) {
	// 	CurrentTimeEntry.set(newValue);
	// 	$rootScope.currentTimeEntry = CurrentTimeEntry.get();
	// }, true);
});

app.controller("SendController", function ($scope, $rootScope, $state, $ionicActionSheet, $ionicPopup, $ionicModal, APP_STATES, TIME_ENTRY_STATUSES, TimeEntries, CurrentTimeEntry, Settings, fixedNumLengthFilter) {
	$rootScope.currentTimeEntry = CurrentTimeEntry.get();

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
		var settings = Settings.get(),
			errors = [],
			errorMessage = "";

		if(settings.recipientEmail === undefined) {
			errors.push("Recipient Email");
		}

		// if(settings.myEmail === undefined) {
		// 	errors.push("My Email");
		// }

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
						$rootScope.currentTimeEntry.status = TIME_ENTRY_STATUSES.final;
					}
					else if(index == 1) {
						$rootScope.currentTimeEntry.status = TIME_ENTRY_STATUSES.draft;
					}
					else if(index == 2) {
						$scope.preview();
					}

					if(index < 2) {
						$rootScope.currentTimeEntry.recipientEmail = settings.recipientEmail;
						$rootScope.currentTimeEntry.dateSent = Date();

						TimeEntries.add($rootScope.currentTimeEntry);
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

						$rootScope.currentTimeEntry = {};
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