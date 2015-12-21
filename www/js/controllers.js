(function () {
	angular.module("strumble.controllers", [])

	.controller("MainController", function ($scope, $state, $ionicPopover, $ionicActionSheet, $ionicModal, TimeEntryService, Settings, APP_STATES) {
		$scope.appStates = APP_STATES
		$scope.timeEntryService = TimeEntryService;

		$ionicPopover.fromTemplateUrl("templates/main/popover.html", {
			scope: $scope
		}).then(function (popover) {
			$scope.popover = popover;
		});

		$ionicModal.fromTemplateUrl("templates/main/preview.html", {
			scope: $scope,
			animation: "slide-in-up"
		}).then(function (modal) {
			$scope.previewModal = modal;
		});


		$scope.$on("destroy", function () {
			$scope.popover.remove();
		});

		var $timeCircle = angular.element("#timer").TimeCircles({
			start: false,
			time: {
				Days: {
					show: false
				},
				Hours: {
					color: "#387ef5"
				},
				Minutes: {
					color: "#387ef5"
				},
				Seconds: {
					color: "#387ef5"
				}
			},
			fg_width: 0.040,
			text_size: 0.080,
			circle_bg_color: "#D2D6E1"
		});

		$timeCircle.addListener(function () {
			TimeEntryService.timerMode.milliseconds = ($timeCircle.getTime() * -1) * 1000;
		}, "visible");

		$scope.openPopover = function ($event) {
			$scope.popover.show($event);
		};

		$scope.goTo = function (stateName) {
			$state.go(stateName);
			$scope.popover.hide();
		};

		$scope.toggleTimer = function () {
			if(TimeEntryService.timerMode.isTimerPlaying) {
				TimeEntryService.timerMode.isTimerPlaying = false;
				$timeCircle.stop();
			}
			else {
				TimeEntryService.timerMode.isTimerPlaying = true;
				$timeCircle.start();
			}
		};

		$scope.clearTimer = function () {
			$timeCircle.restart();
			$timeCircle.stop();
			TimeEntryService.timerMode.isTimerPlaying = false;
		};

		$scope.openPreview = function () {
			$scope.previewModal.show();
		};

		$scope.closePreview = function () {
			$scope.previewModal.hide();
		};

		$scope.send = function (withPreviewOption) {
			var settings = Settings.get(),
				errors = [],
				errorMessage = "";

			if(TimeEntryService.isTimerMode) {
				TimeEntryService.timerMode.isTimerPlaying = false;
				$timeCircle.stop();
			}

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
							if(! $scope.currentTimeEntry.clientName) $scope.currentTimeEntry.clientName = "";
							if(! $scope.currentTimeEntry.phase) $scope.currentTimeEntry.phase = "";
							if(! $scope.currentTimeEntry.matter) $scope.currentTimeEntry.matter = "";
							if(! $scope.currentTimeEntry.narration) $scope.currentTimeEntry.narration = "";
							if(! $scope.currentTimeEntry.units) $scope.currentTimeEntry.units = 0;
							if(! $scope.currentTimeEntry.hours) $scope.currentTimeEntry.hours = 0;
							if(! $scope.currentTimeEntry.minutes) $scope.currentTimeEntry.minutes = 0;
							if(! $scope.currentTimeEntry.seconds) $scope.currentTimeEntry.seconds = 0;

							$scope.currentTimeEntry.myDetails = settings.myDetails;
							$scope.currentTimeEntry.recipientEmails = settings.recipientEmails;
							$scope.currentTimeEntry.dateSent = new Date();
							$scope.currentTimeEntry.id = new Date();

							$ionicLoading.show({ template: "Sending email..." });

							Email.send($scope.currentTimeEntry).success(function (data, status, headers, config) {
								TimeEntries.add($scope.currentTimeEntry);
								AccumulatedTime.add({
									units: $scope.currentTimeEntry.units,
									hours: $scope.currentTimeEntry.hours,
									minutes: $scope.currentTimeEntry.minutes,
									seconds: $scope.currentTimeEntry.seconds,
								});
								
								// resets the CurrentTimeEntry
								CurrentTimeEntry.clientName = "";
								CurrentTimeEntry.matter = "";
								CurrentTimeEntry.phase = "";
								CurrentTimeEntry.narration = "";
								CurrentTimeEntry.units = "";
								CurrentTimeEntry.hours = "";
								CurrentTimeEntry.minutes = "";
								CurrentTimeEntry.seconds = "";
								CurrentTimeEntry.milliseconds = "";

								delete CurrentTimeEntry.recipientEmail;
								delete CurrentTimeEntry.dateSent;

								$scope.previewModal.hide();
								$state.go(APP_STATES.main);

								$ionicLoading.hide();
								$ionicPopup.alert({
									title: "Success!",
									template: "Time entry has been saved and sent successfully."
								});
							}).error(function (data, status, headers, config) {
								$ionicLoading.hide();
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
	})

	.controller("SettingsController", function ($scope, Settings) {
		$scope.settings = Settings.get();
		$scope.tempSettings = Settings.get();

		$scope.setMyDetails = function () {

		};

		$scope.setRecipientEmails = function () {

		};

		$scope.setMinutesPerUnit = function () {

		};
	})

	.controller("TimeEntryListController", function ($scope, TimeEntries) {
		$scope.timeEntries = TimeEntries.getAll();
		console.log($scope.timeEntries);
	});
})();