// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module("strumble", ["ionic", "ngResource"]);

app.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});

app.constant("APP_STATES", {
	app: "app",
	main: "app.main",
	moreInfo: "app.more-info",
	settings: "app.settings",
	stats: "app.stats",
	timeEntryList: "app.time-entry-list",
	timeEntryDetails: "app.time-entry-details"
});

app.constant("TIME_ENTRY_STATUSES", {
	draft: "Draft",
	final: "Final"
});

app.constant("DEFAULT_SETTINGS", {
	timerModeAsDefault: true,
	minutesPerUnit: 6,
	myDetails: {},
	recipientEmails: [{}]
});

app.constant("TIMER_LIMITS", {
	units: 99,
	hours: 99,
	minutes: 60,
	seconds: 60,
	milliseconds: 1000
});

app.config(function ($stateProvider, $urlRouterProvider, APP_STATES) {
	$stateProvider
	.state(APP_STATES.app, {
		url: "/app",
		abstract: true,
		templateUrl: "templates/app.html"
	})
	.state(APP_STATES.main, {
		url: "/main",
		views: {
			"main": {
				templateUrl: "templates/main/index.html"
			}
		}
	})
	.state(APP_STATES.moreInfo, {
		url: "/main/more-info",
		views: {
			"main": {
				templateUrl: "templates/main/more-info.html"
			}
		}
	})
	.state(APP_STATES.settings, {
		url: "/settings",
		views: {
			"main": {
				templateUrl: "templates/settings/index.html"
			}
		}
	})
	.state(APP_STATES.stats, {
		url: "/stats",
		views: {
			"main": {
				templateUrl: "templates/stats.html"
			}
		}
	})
	.state(APP_STATES.timeEntryList, {
		url: "/time-entry-list",
		views: {
			"main": {
				templateUrl: "templates/time-entry-list/index.html"
			}
		}
	})
	.state(APP_STATES.timeEntryDetails, {
		url: "/time-entry-details/:timeEntryId",
		views: {
			"main": {
				templateUrl: "templates/time-entry-list/details.html"
			}
		}
	});

	$urlRouterProvider.otherwise("/app/main");
});
