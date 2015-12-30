(function () {
	angular.module("strumble.controllers", [])

	.controller("MainController", function ($scope, $state, $ionicPopover, $ionicActionSheet, $ionicModal, $ionicLoading, $ionicPopup, TimeEntryService, TimeEntries, Settings, Email, APP_STATES, TIME_ENTRY_STATUSES) {
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

		$scope.isMoreInfoShown = true;
		$scope.toggleMoreInfo = function () {
			if($scope.isMoreInfoShown) {
				$scope.isMoreInfoShown = false;	
			}
			else {
				$scope.isMoreInfoShown = true;
			}
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

				if(withPreviewOption) {
					actionSheetButtons.push({ text: "Preview" });
				}

				$ionicActionSheet.show({
					buttons: actionSheetButtons,
					titleText: "Sending Options",
					cancelText: "Cancel",
					buttonClicked: function (index) {
						var settings = Settings.get()

						if(index == 0) {
							TimeEntryService.sentAs = TIME_ENTRY_STATUSES.final;
						}
						else if(index == 1) {
							TimeEntryService.sentAs = TIME_ENTRY_STATUSES.draft;
						}
						else if(index == 2) {
							$scope.openPreview();
						}

						if(index < 2) {
							$ionicLoading.show({ template: "<ion-spinner></ion-spinner>" });

							if(! TimeEntryService.clientName) TimeEntryService.clientName = "";
							if(! TimeEntryService.phase) TimeEntryService.phase = "";
							if(! TimeEntryService.matter) TimeEntryService.matter = "";
							if(! TimeEntryService.narration) TimeEntryService.narration = "";

							TimeEntryService.myDetails = settings.myDetails;
							TimeEntryService.recipientEmails = settings.recipientEmails;

							Email.send(TimeEntryService)
							.success(function (data, status, headers, config) {
								TimeEntries.add(TimeEntryService);
								$scope.previewModal.hide(); // hides preview modal if shown
								$ionicLoading.hide();
								$ionicPopup.alert({
									title: "Success",
									template: "<div style='width: 100%; text-align: center;'><h1><i class='ion-ribbon-b'></i></h1>Time entry has been saved and sent successfully.</div>"
								});

								TimeEntryService.clientName = "";
								TimeEntryService.matter = "";
								TimeEntryService.phase = "";
								TimeEntryService.narration = "";
								TimeEntryService.timerMode.milliseconds = 0;
								TimeEntryService.manualMode.units = "";

								$timeCircle.restart();
								$timeCircle.stop();
							})
							.error(function (data, status, headers, config) {
								$ionicLoading.hide();
								$ionicPopup.alert({
									title: "Sending Failed",
									template: "<div style='width: 100%; text-align: center;'><h1><i class='ion-close-circled'></i></h1>" +
											  "An error occured. Make sure you have a stable internet connection.</div>"
								});
							});
						}

						return true;
					}
				});
			}
		};
	})

	.controller("SettingsController", function ($scope, $ionicPopup, Settings) {
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

		$scope.$watch("settings.timerModeAsDefault", function (newValue, oldValue) {
			Settings.set($scope.settings);
			$scope.settings = Settings.get();
		});

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
			$scope.tempSettings.minutesPerUnit = (!newValue || newValue < 0) ? "" : parseInt(newValue);
		});
	})

	.controller("TimeEntryListController", function ($scope, TimeEntries, AccumulatedTime, TimeUtility) {
		$scope.accumulatedTime = AccumulatedTime;
		$scope.timeEntries = TimeEntries.getAll();
		$scope.timeUtility = TimeUtility;
	})

	.controller("TimeEntryDetailController", function ($scope, $stateParams, TimeEntries, TimeUtility) {
		$scope.timeEntry = TimeEntries.get($stateParams.timeEntryId);
		$scope.timeUtility = TimeUtility;
	});
})();