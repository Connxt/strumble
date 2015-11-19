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
	var timer,
		settings = Settings.get();

	$scope.appStates = APP_STATES;
	$scope.currentTimeEntry = CurrentTimeEntry.get();

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

	$scope.goToMoreInfo = function () {
		$state.go($scope.appStates.moreInfo);
	};
});

app.controller("MoreInfoController", function ($scope, CurrentTimeEntry) {
	$scope.currentTimeEntry = CurrentTimeEntry.get();

	$scope.$watch("currentTimeEntry", function (newValue, oldValue) {
		CurrentTimeEntry.set(newValue);
		$scope.currentTimeEntry = CurrentTimeEntry.get();
		console.log(CurrentTimeEntry.get());
	}, true);
});

app.controller("SendController", function ($scope, $state, $ionicActionSheet, APP_STATES, TIME_ENTRY_STATUSES, TimeEntries, CurrentTimeEntry, Settings) {
	$scope.show = function () {
		var hideSheet = $ionicActionSheet.show({
			buttons: [
				{ text: "Send as final" },
				{ text: "Send as draft" },
			],
			titleText: "Sending Options",
			cancelText: "Cancel",
			buttonClicked: function (index) {
				var settings = Settings.get(),
					currentTimeEntry = CurrentTimeEntry.get();

				if(index == 0) {
					currentTimeEntry.status = TIME_ENTRY_STATUSES.final;
				}
				else if(index == 1) {
					currentTimeEntry.status = TIME_ENTRY_STATUSES.draft;
				}
	
				if(index >= 0) {
					$state.go(APP_STATES.main);
					currentTimeEntry.recipientEmail = settings.recipientEmail;
					currentTimeEntry.dateSent = Date();

					TimeEntries.add(currentTimeEntry);
				}	

				return true;
			}
		});
	};
});

app.controller("TimeEntryListController", function ($scope, TimeEntries, $ionicPopup) {
	$scope.timeEntries = TimeEntries.getAll();

	$scope.showAlert = function() {
		var alertPopup = $ionicPopup.alert({
			title: 'Don\'t eat that!',
			template: 'It might taste good'
		});

		alertPopup.then(function(res) {
			console.log('Thank you for not eating my delicious ice cream cone');
		});

	};
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