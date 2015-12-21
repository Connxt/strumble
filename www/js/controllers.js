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

		angular.element("#timer").TimeCircles({
			time: {
				Days: {
					show: false
				}
			}
		});

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
				// $timeCircle.start();
				angular.element("#timer").TimeCircles().start();
			}
			else {
				TimeEntryService.timerMode.isTimerPlaying = true;
				// $timeCircle.stop();
				angular.element("#timer").TimeCircles().stop();
				// console.log($timeCircle.getTime());
			}
		};

		$scope.clearTimer = function () {
			TimeEntryService.timerMode.clear();
			TimeEntryService.timerMode.pause();
			TimeEntryService.timerMode.isTimerPlaying = false;
		};
	})

	.controller("SettingsController", function ($scope) {

	});
})();