app.controller("HeaderController", function ($scope, $state, $ionicPopover, $ionicHistory, APP_STATES) {
	$scope.appStates = APP_STATES;

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

app.controller("TimerController", function ($scope, $state, $interval, APP_STATES, TimeEntries, Settings, CurrentTimeEntry) {
	var timer;

	$scope.appStates = APP_STATES;
	$scope.currentTimeEntry = CurrentTimeEntry.get();

	// Timer States
	$scope.currentTimeEntry.isTimerMode = Settings.get().timerModeAsDefault;
	$scope.isPlaying = false;

	// Timer Values
	$scope.currentTimeEntry.hours = 0;
	$scope.currentTimeEntry.minutes = 0;
	$scope.currentTimeEntry.seconds = 0;
	$scope.currentTimeEntry.milliseconds = 0;

	// Other Details
	$scope.currentTimeEntry.clientName = "";

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
				$scope.currentTimeEntry.milliseconds += 100;

				if($scope.currentTimeEntry.milliseconds >= 1000) {
					$scope.currentTimeEntry.seconds++;
					$scope.currentTimeEntry.milliseconds = 0;
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
		$scope.currentTimeEntry.milliseconds = 0;
	};

	$scope.validateTimerFields = function () {
		$scope.currentTimeEntry.hours = ($scope.currentTimeEntry.hours === null || isNaN($scope.currentTimeEntry.hours) || $scope.currentTimeEntry.hours > 99) ? 0 : parseInt($scope.currentTimeEntry.hours);
		$scope.currentTimeEntry.minutes = ($scope.currentTimeEntry.minutes === null || isNaN($scope.currentTimeEntry.minutes) || $scope.currentTimeEntry.minutes > 60) ? 0 : parseInt($scope.currentTimeEntry.minutes);
		$scope.currentTimeEntry.seconds = ($scope.currentTimeEntry.seconds === null || isNaN($scope.currentTimeEntry.seconds) || $scope.currentTimeEntry.seconds > 60) ? 0 : parseInt($scope.currentTimeEntry.seconds);
	};

	$scope.saveCurrentTimeEntry = function () {
		
	};

	$scope.goToMoreInfo = function () {
		$state.go($scope.appStates.moreInfo);
	};
});

app.controller("MoreInfoController", function ($scope, CurrentTimeEntry) {

});

app.controller("SendController", function ($scope, $state, $ionicActionSheet, APP_STATES, TimeEntries) {
	$scope.show = function () {
		var hideSheet = $ionicActionSheet.show({
			buttons: [
				{ text: "Send as final" },
				{ text: "Send as draft" },
			],
			titleText: "Sending Options",
			cancelText: "Cancel",
			buttonClicked: function (index) {
				if(index == 0) {
					$state.go(APP_STATES.main);
				}
				else if(index == 1) {
					$state.go(APP_STATES.main);
				}

				return true;
			}
		});
	};
});

app.controller("TimeEntryListController", function ($scope, TimeEntries) {
	$scope.timeEntries = TimeEntries.getAll();
});

app.controller("SettingsController", function ($scope, $ionicPopup, Settings) {
	$scope.settings = Settings.get();
	$scope.tempSettings = {};
	angular.copy($scope.settings, $scope.tempSettings);

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