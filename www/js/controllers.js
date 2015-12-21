(function () {
	angular.module("strumble.controllers", [])

	.controller("MainController", function ($scope, $state, $ionicPopover, TimeEntryService, APP_STATES) {
		$scope.appStates = APP_STATES
		$scope.timeEntryService = TimeEntryService;

		$ionicPopover.fromTemplateUrl("templates/main/popover.html", {
			scope: $scope
		}).then(function (popover) {
			$scope.popover = popover;
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
			text_size: 0.098,
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

		$scope.send = function () {
			console.log(TimeEntryService.manualMode.getTime());
		};

		$scope.toggleTimer = function () {
			// if(TimeEntryService.timerMode.isTimerPlaying) {
			// 	TimeEntryService.timerMode.isTimerPlaying = false;
			// 	TimeEntryService.timerMode.pause();
			// }
			// else {
			// 	TimeEntryService.timerMode.isTimerPlaying = true;
			// 	TimeEntryService.timerMode.start();
			// }
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
			// TimeEntryService.timerMode.clear();
			// TimeEntryService.timerMode.pause();
			$timeCircle.restart();
			$timeCircle.stop();
			TimeEntryService.timerMode.isTimerPlaying = false;
		};
	})

	.controller("SettingsController", function ($scope) {

	});
})();