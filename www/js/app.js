(function () {
	angular.module("strumble", [
		"strumble.controllers",
		"strumble.services",
		"strumble.directives",
		"strumble.filters",
		"ionic",
		"ngResource"
	])

	.run(function ($ionicPlatform, Settings) {
		$ionicPlatform.ready(function () {
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.disableScroll(true);
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				Keyboard.disableScrollingInShrinkView(true);
			}
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}
		});


		// if there are no settings saved
		if(Object.keys(Settings.get()).length <= 0) {
			Settings.set({
				timerModeAsDefault: true,
				minutesPerUnit: 6,
				myDetails: {},
				recipientEmails: [{}]
			});
		}
	})

	.config(function ($stateProvider, $urlRouterProvider, APP_STATES) {
		$stateProvider
		.state(APP_STATES.app, {
			url: "/app",
			abstract: true,
			templateUrl: "templates/abstract.html"
		})
		.state(APP_STATES.main, {
			url: "/main",
			views: {
				"main": {
					templateUrl: "templates/main/index.html",
					controller: "MainController"
				}
			}
		})
		.state(APP_STATES.settings, {
			url: "/settings",
			views: {
				"main": {
					templateUrl: "templates/settings/index.html",
					controller: "SettingsController"
				}
			}
		})
		.state(APP_STATES.timeEntryList, {
			url: "/time-entry-list",
			views: {
				"main": {
					templateUrl: "templates/time-entry-list/index.html",
					controller: "TimeEntryListController"
				}
			}
		})
		.state(APP_STATES.timeEntryDetails, {
			url: "/time-entry-list/:timeEntryId",
			views: {
				"main": {
					templateUrl: "templates/time-entry-list/detail.html",
					controller: "TimeEntryDetailController"
				}
			}
		});

		$urlRouterProvider.otherwise("/app/main");
	})

	.constant("APP_STATES", {
		app: "app",
		main: "app.main",
		moreInfo: "app.more-info",
		settings: "app.settings",
		stats: "app.stats",
		timeEntryList: "app.time-entry-list",
		timeEntryDetails: "app.time-entry-details"
	})

	.constant("TIME_ENTRY_STATUSES", {
		draft: "Draft",
		final: "Final"
	})
})();
