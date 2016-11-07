//loading the 'login' angularJS module

var login = angular.module('login', ['ui.router','ngRoute','ngResource']);

//to store session data
var order_total=0;
var display_name='';
var session_owner='';
login.config(function($stateProvider, $urlRouterProvider, $locationProvider,$routeProvider) {
		$locationProvider.html5Mode(true);
		$stateProvider.state('login', {	
			url : '/',
			views: {
	            'header': {
	                templateUrl : 'templates/header.html',
	            },
	            'content': {
	                templateUrl : 'templates/login.html',
	            },
			}
		}).state('index',{
			url : '/index',
			controller: 'login',
			params : {USER: null},
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
		}).state('products',{
			url : '/products',
			controller: 'login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/products.html',
	            },
			}
		}).state('cart',{
			url : '/cart',
			controller: 'login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/cart.html',
	            },
			}
		}).state('contactus',{
			url : '/contactus',
			controller: 'login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/contactus.html',
	            },
			}
		}).state('checkout',{
			url : '/checkout',
			controller: 'login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/checkout.html',
	            },
			}
		}).state('payment_success',{
			url : '/payment_success',
			controller: 'login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/payment_success.html',
	            },
			}
		}).state('sell_product',{
			url : '/sell_product',
			controller: 'login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/sell_product.html',
	            },
			}
		}).state('cx_info',{
			url : '/cx_info',
			controller: 'login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/cx_info.html',
	            },
			}
		}).state('cx_orders',{
			url : '/cx_orders',
			controller: 'login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/cx_orders.html',
	            },
			}
		}).state('cx_bids',{
			url : '/cx_bids',
			controller: 'login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/cx_bids.html',
	            },
			}
		}).state('bidding',{
			url : '/bidding',
			controller: 'login',
			views: {
	            'header': {
	                templateUrl : 'templates/header1.html',
	            },
	            'sidebar':{
	            	templateUrl : 'templates/sidebar.html'
	            },
	            'content': {
	                templateUrl : 'templates/product_bid.html',
	            },
			}
		});
		$urlRouterProvider.otherwise('/');
});
//defining the login controller
login.controller('login', function($scope,$http,$state) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	
	$scope.invalid_product=true;
	$scope.valid_product=true;
	$scope.invalid_login = true;
	$scope.validlogin = true;
	$scope.invalid_bid = true;
	$scope.valid_bid = true;
	$scope.category_list=["electronics","clothes","sports","kitchen","mobile","laptop","garden","home","living","media"];
	
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/checklogin',
			data : {
				"username" : $scope.username,
				"password" : $scope.password
			}
		}).success(function(data) {
			console.log(data);
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.validlogin = true;
			}
			else{
				$scope.validlogin = false;
				$scope.invalid_login = true;
				console.log(data.display_name+"\t"+data.session_owner);
				display_name=data.display_name;
				session_owner=data.session_owner;
				$scope.session_owner=session_owner;
				$scope.display_name=display_name;
				$state.go('index');
				console.log("testing");
			} 
		}).error(function(error) {
			$scope.validlogin = true;
			$scope.invalid_login = true;
		});
	};
	
	$scope.register = function(){
		console.log("hey Call is here");
		window.location.assign('/register');
	};
	$scope.fetchProducts_e = function() {
		$scope.display_name=display_name;
		$scope.session_owner=session_owner;
		$http({
			method : "POST",
			url : '/fetchProducts',
			data : {
				"category":'Electronics'
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else{
				console.log(data.products[0]._id);
				$scope.products=data.products;
			}
		}).error(function(error) {		
			
		});
	};
	$scope.fetchProducts_c = function() {
		$scope.display_name=display_name;
		$scope.session_owner=session_owner;
		$http({
			method : "POST",
			url : '/fetchProducts',
			data : {
				"category":'Clothes'
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else{
				$scope.products=data.products;
			}
		}).error(function(error) {		
			
		});
	};
	$scope.fetchProducts_s = function() {
		$scope.display_name=display_name;
		$scope.session_owner=session_owner;
		$http({
			method : "POST",
			url : '/fetchProducts',
			data : {
				"category":'Sports'
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else{
				$scope.products=data.products;
			}
		}).error(function(error) {		
			
		});
	};
	$scope.fetchProducts_k = function() {
		$scope.display_name=display_name;
		$scope.session_owner=session_owner;
		$http({
			method : "POST",
			url : '/fetchProducts',
			data : {
				"category":'Kitchen'
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else{
				$scope.products=data.products;
			}
		}).error(function(error) {		
			
		});
	};
	$scope.fetchProducts_m = function() {
		$scope.display_name=display_name;
		$http({
			method : "POST",
			url : '/fetchProducts',
			data : {
				"category":'Mobile'
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else{
				$scope.products=data.products;
			}
		}).error(function(error) {		
			
		});
	};
	$scope.fetchProducts_l = function() {
		$scope.display_name=display_name;
		$http({
			method : "POST",
			url : '/fetchProducts',
			data : {
				"category":'Laptop'
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else{
				$scope.products=data.products;
			}
		}).error(function(error) {		
			
		});
	};
	$scope.fetchProducts_g = function() {
		$scope.display_name=display_name;
		$http({
			method : "POST",
			url : '/fetchProducts',
			data : {
				"category":'Garden'
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else{
				$scope.products=data.products;
			}
		}).error(function(error) {		
			
		});
	};
	$scope.fetchProducts_h = function() {
		$scope.display_name=display_name;
		$http({
			method : "POST",
			url : '/fetchProducts',
			data : {
				"category":'Home'
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else{
				$scope.products=data.products;
			}
		}).error(function(error) {		
			
		});
	};
	$scope.fetchProducts_li = function() {
		$scope.display_name=display_name;
		$http({
			method : "POST",
			url : '/fetchProducts',
			data : {
				"category":'Living'
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else{
				$scope.products=data.products;
			}
		}).error(function(error) {		
			
		});
	};
	$scope.fetchProducts_me = function() {
		$scope.display_name=display_name;
		$http({
			method : "POST",
			url : '/fetchProducts',
			data : {
				"category":'Media'
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else{
				$scope.products=data.products;
			}
		}).error(function(error) {		
			
		});
	};
	$scope.addToCart = function(id){
		$scope.display_name=display_name;
		console.log("Hey Call is here");
		console.log(id);
		$http({
			method : "POST",
			url : '/addToCart',
			data : {
				"product_id" : id,
				"test":'test',
				"session_owner":session_owner
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				console.log("Oops Something went wrong!!");
			}
			else{
				console.log(session_owner);
				console.log("Item added to your cart");
			} 
		}).error(function(error) {
				
		})
		};
		$scope.showCart = function() {
			$scope.display_name=display_name;
			$http({
				method : "POST",
				url : '/showCart',
				data : {
					"session_owner":session_owner
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 401) {
					console.log("Oops Something went wrong!!");
				}
				else{
					console.log("creating join");
					var i,j;
					var k;
					k=Number(0);
					for(i=0;i<data.ids.length;i++){
						for(j=0;j<data.result.length;j++){
							console.log(data.result[j]._id+"\tmatching\t"+data.ids[i]);
							if(data.ids[i]==data.result[j]._id){
								console.log("inserting found product");
								data.products[i]=data.result[j];
							}
						}
					}
					console.log("join created\n"+data.products);
					order_total=0;
					for(i=0;i<data.products.length;i++){
						console.log(data.products.product_value);
						order_total+=Number(data.products[i].product_value);
					}
					$scope.cart_total=order_total;
					$scope.products=data.products;
				}
			}).error(function(error) {		
				
			});
		};
		$scope.removeFromCart = function(id){
			$scope.display_name=display_name;
			console.log("Hey Call is here");
			console.log(id);
			$http({
				method : "POST",
				url : '/removeFromCart',
				data : {
					"product_id" : id,
					"test":'test',
					"session_owner":session_owner
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 401) {
					console.log("Oops Something went wrong!!");
				}
				else{
					console.log(session_owner);
					console.log("Item removed from your cart");
				} 
			}).error(function(error) {
					
			})
			};
			$scope.checkout = function(){
				$scope.display_name=display_name;
				console.log(order_total);
				$http({
					method : "POST",
					url : '/checkout',
					data : {
						"test":'test',
						"session_owner":session_owner,
						"order_total":order_total
					}
				}).success(function(data) {
					//checking the response data for statusCode
					if (data.statusCode == 401) {
						console.log("Oops Something went wrong!!");
					}
					else{
						console.log(session_owner);
						console.log("yahoo your order is placed");
						$scope.cart_total=order_total;
						$state.go('checkout');
					} 
				}).error(function(error) {
						
				})
				};
				$scope.payment_success = function(){
					$scope.display_name=display_name;
					console.log("Hey Call is here");
					$state.go('payment_success');
				};
				$scope.sell_product=function(){
					$scope.display_name=display_name;
					$state.go('sell_product');
				};
				$scope.add_product=function(){
					$scope.display_name=display_name;
					console.log();
					$http({
						method : "POST",
						url : '/add_product',
						data : {
							"session_owner":session_owner,
							"product_name":$scope.product_name,
							"product_price":$scope.product_price,
							"product_quantity":$scope.product_quantity,
							"product_desc":$scope.product_desc,
							"product_condi":$scope.product_condi,
							"product_category":$scope.product_category
						}
					}).success(function(data) {
						//checking the response data for statusCode
						if (data.statusCode == 401) {
							console.log("Oops Something went wrong!!");
							$scope.invalid_product=false;
							$scope.valid_product=true;
						}
						else{
							$scope.valid_product=false;
							$scope.invalid_product=true;
							console.log(session_owner);
							console.log("yahoo product is in our inventory");
							
						} 
					}).error(function(error) {
							
					})
				};
				$scope.fetchProducts_nb = function() {
					$scope.display_name=display_name;
					
					$http({
						method : "POST",
						url : '/fetchProducts_nb',
						data : {
							"session_owner":session_owner,
						}
					}).success(function(data) {
						//checking the response data for statusCode
						if (data.statusCode == 401) {
							
						}
						else{
							$scope.products=data.products;
						}
					}).error(function(error) {		
						
					});
				};
				$scope.fetchProducts_b = function() {
					$scope.display_name=display_name;
					
					$http({
						method : "POST",
						url : '/fetchProducts_b',
						data : {
							"session_owner":session_owner,
						}
					}).success(function(data) {
						//checking the response data for statusCode
						if (data.statusCode == 401) {
							
						}
						else{
							$scope.products=data.products;
						}
					}).error(function(error) {		
						
					});
				};
				$scope.fetchProducts_all = function() {
					$scope.display_name=display_name;
					
					$http({
						method : "POST",
						url : '/fetchProducts_all',
						data : {
							
						}
					}).success(function(data) {
						//checking the response data for statusCode
						if (data.statusCode == 401) {
							
						}
						else{
							$scope.products=data.products;
						}
					}).error(function(error) {		
						
					});
				};
				$scope.logout=function(){
					$scope.display_name=display_name;
					$http({
						method : "POST",
						url : '/logout',
						data : {
							"session_owner":session_owner,
						}
					}).success(function(data) {
						//checking the response data for statusCode
						if (data.statusCode == 401) {
							
						}
						else{
							
						}
					}).error(function(error) {		
						
					});

				};
				$scope.getCxInfo=function(){
					$scope.display_name=display_name;
					$scope.session_owner=session_owner;
					console.log("hey call is here");
				};
				$scope.getCxOrders=function(){
					$scope.display_name=display_name;
					$scope.session_owner=session_owner;

					$http({
						method : "POST",
						url : '/getCxOrders',
						data : {
							"session_owner":session_owner,
						}
					}).success(function(data) {
						//checking the response data for statusCode
						if (data.statusCode == 401) {
							
						}
						else{
							$scope.orders=data.products;
						}
					}).error(function(error) {		
						
					});

				};
				$scope.getCxProducts=function(){
					$scope.display_name=display_name;
					$scope.session_owner=session_owner;
					$http({
						method : "POST",
						url : '/getCxProducts',
						data : {
							"session_owner":session_owner,
						}
					}).success(function(data) {
						//checking the response data for statusCode
						if (data.statusCode == 401) {
							
						}
						else{
							$scope.products=data.products;
						}
					}).error(function(error) {		
						
					});
				};
				$scope.place_bid=function(id,bid_value,product_value){
					$scope.display_name=display_name;
					$scope.session_owner=session_owner;
					console.log(bid_value+"\t"+product_value)
					if(product_value<bid_value){
					$http({
						method : "POST",
						url : '/place_bid',
						data : {
							"session_owner":session_owner,
							"id":id,
							"bid_value":bid_value
						}
					}).success(function(data) {
						//checking the response data for statusCode
						if (data.statusCode == 401) {
							console.log("Hey your bid could not be placed");
							$scope.valid_bid=true;
							$scope.invalid_bid=false;
						}
						else{
							$scope.valid_bid=false;
							$scope.invalid_bid=true;
							console.log("Hey your bid is placed");
						}
					}).error(function(error) {		
							
					});
					}
					else{
						console.log("Hey your bid could not be placed because of no function call");
						$scope.valid_bid=true;
						$scope.invalid_bid=false;
					}

				};

});