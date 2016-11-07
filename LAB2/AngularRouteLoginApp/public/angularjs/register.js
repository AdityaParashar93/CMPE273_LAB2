var register = angular.module('register', ['ui.router','ngRoute','ngResource']);
var content_path='';
register.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
		content_path='templates/register.html';
		$locationProvider.html5Mode(true);
		$stateProvider.state('register', {	
			url : '/register',
			views: {
	            'header': {
	                templateUrl : 'templates/header.html',
	            },
	            'content': {
	                templateUrl : content_path,
	            },
			}
		}).state('login',{
			url : '/login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : '',
	            },
	            'content': {
	                templateUrl : 'templates/login.html',
	            },
			}
		}).state('index',{
			url : '/index',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/index.html',
	            },
			}
		});
	$urlRouterProvider.otherwise('/');
});
	register.controller('register', function($scope, $http,$state) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	
	$scope.invalid_data = true;
	$scope.validlogin = true;
	
	$scope.register = function() {
		$http({
			method : "POST",
			url : '/registeruser',
			data : {
				"first_name" : $scope.first_name,
				"last_name" : $scope.last_name,
				"display_name":$scope.display_name,
				"email":$scope.email,
				"password" : $scope.password,
			}
		}).success(function(data) {
			//checking the response data for statusCode
			console.log("\n"+$scope.first_name+"\n"+$scope.last_name+"\n"+$scope.display_name+"\n"+$scope.email+"\n"+$scope.password);
			if (data.statusCode == 401) {
				$scope.invalid_data = false;
				$scope.validlogin = true;
			}
			else{
				$scope.validlogin = false;
				$scope.invalid_login = true;
				$state.go('login', {});
			}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
		}).error(function(error) {
			$scope.validlogin = true;
			$scope.invalid_login = true;
		});
	};
	$scope.login=function(){
		console.log("Copy that");
		window.location.assign("/login");
	}
})