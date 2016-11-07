var winston = require('winston');
var ejs = require("ejs");
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.logger)(),
		new (winston.transports.File)({ filename: 'ebayLog.log' })
	]
});

exports.handle_request_checkLogin = function(msg, callback){
	var res={};
	var json_responses;
	logger.log("In handle request:"+ msg.username);
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('userinfo');
		
		process.nextTick(function(){
			coll.findOne({cx_email:msg.username,cx_password:msg.password},function(err,user){

				if(err) {
					connection.close();
					logger.log("something went wrong");
					logger.log("something went wrong");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }

				else if(!user) {
					connection.close();
					logger.log("user not found");
					logger.log("user not found");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else {
					logger.log("user found");
					logger.log(user.cx_display);
					logger.log(user.cx_email);
					res.json_responses={"statusCode":200,"session_owner":user.cx_email,"display_name":user.cx_display};
					callback(null, res);
				}
		});
		});
	});
};
exports.handle_request_fetchProducts = function(msg, callback){
	var res={};
	var json_responses;
	logger.log("In handle request:"+ msg.username);
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('products');
		
		process.nextTick(function(){
			coll.find({"product_category":msg.product_category,"product_seller":msg.product_seller}).toArray(function(err,rows){

				if(err) {
					connection.close();
					logger.log("something went wrong");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else if(!rows) {
					connection.close();
					logger.log("not found");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else {
					logger.log("rows found");
					res.json_responses={"status code":200,"products":rows};
					callback(null, res);
				}
		});
		});
	});
};
exports.handle_request_fetchProducts_nb = function(msg, callback){
	var res={};
	var json_responses;
	logger.log("In handle request:"+ msg.username);
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('products');
		
		process.nextTick(function(){
			coll.find({"product_condi":msg.product_condi}).toArray(function(err,rows){

				if(err) {
					connection.close();
					logger.log("something went wrong");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else if(!rows) {
					connection.close();
					logger.log("not found");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else {
					logger.log("rows found");
					res.json_responses={"status code":200,"products":rows};
					callback(null, res);
				}
		});
		});
	});
};
exports.handle_request_fetchProducts_b = function(msg, callback){
	var res={};
	var json_responses;
	logger.log("In handle request:"+ msg.username);
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('products');
		
		process.nextTick(function(){
			coll.find({"product_condi":msg.product_condi}).toArray(function(err,rows){

				if(err) {
					connection.close();
					logger.log("something went wrong");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else if(!rows) {
					connection.close();
					logger.log("not found");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else {
					logger.log("rows found");
					res.json_responses={"status code":200,"products":rows};
					callback(null, res);
				}
		});
		});
	});
};
exports.handle_request_fetchProducts_all = function(msg, callback){
	var res={};
	var json_responses;
	logger.log("In handle request:"+ msg.username);
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('products');
		
		process.nextTick(function(){
			coll.find({"product_seller":msg.product_seller}).toArray(function(err,rows){

				if(err) {
					connection.close();
					logger.log("something went wrong");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else if(!rows) {
					connection.close();
					logger.log("not found");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else {
					logger.log("rows found");
					res.json_responses={"status code":200,"products":rows};
					callback(null, res);
				}
		});
		});
	});
};
exports.handle_request_addToCart = function(msg, callback){
	var res={};
	var json_responses;
	logger.log("In handle request:"+ msg.username);
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		logger.log(msg.cx_email);
		logger.log(msg.cx_email);
		var coll=mongo.collection('cart');
		process.nextTick(function(){
			coll.insert({cx_email:msg.cx_email,product_id:msg.product_id},function(err,rows){

				if(err) {
					connection.close();
					logger.log("something went wrong");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else if(!rows) {
					connection.close();
					logger.log("not found");
					res.json_responses={"statusCode":401};
					callback(null, res);
	            }
				else {
					logger.log("data inserted successfully");
					connection.close();
					res.json_responses = {"statusCode" : 200};
					callback(null, res);
				}
		});
		});
	});
};
exports.handle_request_showCart = function(msg, callback){
	var res={};
	var json_responses;
	var result;
	var final_result=[];
	var ids=[];
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('cart');
		var coll1=mongo.collection('products');
		process.nextTick(function(){
			coll.find({"cx_email":msg.cx_email}).toArray(function(err,rows){
				if(err){
					connection.close();
					logger.log("returned false");
					res.json_responses = {"statusCode" : 401};
					callback(null, res);
				}
				else{
					var i=0;
					while(i<rows.length){
						ids[i]=rows[i++].product_id;
					}
					//json_responses={"status code":200,"products":rows1};
					//res.send(json_responses);	
				}
			});
		});
		process.nextTick(function(){
			coll1.find().toArray(function(err,rows){
				if(err){
					connection.close();
					logger.log("returned false");
					res.json_responses = {"statusCode" : 401};
					callback(null, res);
				}
				else{
					result=rows;
					logger.log(result);
					connection.close();
					res.json_responses={"status code":200,"products":final_result,"ids":ids,"result":result};
					callback(null, res);	
				}
			});
		});
	});
};
exports.handle_request_removeFromCart = function(msg, callback){
	var res={};
	var json_responses;
	logger.log("In handle request:"+ msg.username);
	mongo.connect(mongoURL,function(connection){
	logger.log("Connected to mongo at:"+mongoURL);
	var coll=mongo.collection('cart');
	var json_responses;
	process.nextTick(function(){
	coll.remove({cx_email:msg.cx_email,product_id:msg.product_id},function(err,user){
		if(user){
			logger.log("data inserted successfully");
			connection.close();
			res.json_responses = {"statusCode" : 200};
			callback(null,res);
		}
		else{
			connection.close();
			logger.log("returned false");
			res.json_responses = {"statusCode" : 401};
			callback(null,res);
		}
	});
	});
	});
};
exports.handle_request_checkout = function(msg, callback){
	var res={};
	var json_responses;
	var ids=[];
	var result=[];
	logger.log("In handle request:"+ msg.username);
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('cart');
		var coll1=mongo.collection('products');
		process.nextTick(function(){
			coll.find({"cx_email":msg.cx_email}).toArray(function(err,rows){
				if(err){
					connection.close();
					logger.log("returned false");
					res.json_responses = {"statusCode" : 401};
					callback(null,res);
				}
				else{
					var i=0;
					while(i<rows.length){
						ids[i]=rows[i++].product_id;
					}
				}
				logger.log(ids);	
			});
		});
		process.nextTick(function(){
			coll.remove({cx_email:msg.cx_email},function(err,user){
				if(user){
					logger.log("data removed successfully");
				}
				else{
					connection.close();
					logger.log("returned false");
					res.json_responses = {"statusCode" : 401};
					callback(null,res);
				}
			});
		});
	});
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('orders');
		var json_responses;
		coll.insert({cx_email:msg.cx_email,order_total:msg.order_total},function(err,user){
			if(user){
				logger.log("data inserted successfully");
				connection.close();
				res.json_responses = {"statusCode" : 200};
				callback(null,res);
			}
			else{
				logger.log("returned false");
				connection.close();
				res.json_responses = {"statusCode" : 401};
				callback(null,res);
			}
		});
	});
};
exports.handle_request_addProduct = function(msg, callback){
	var res={};
	var json_responses;
	logger.log("In handle request:"+ msg.username);
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('products');
		coll.insert({"product_name":msg.product_name,"product_seller":msg.product_seller,"product_value":msg.product_value,"product_inventory":msg.product_inventory,"product_desc":msg.product_desc,"product_condi":msg.product_condi,"product_category":msg.product_category,"product_date":new Date().getDay(),"product_owner":"EBay"},function(err,user){
			if(user){
				logger.log("data inserted successfully in products");
				connection.close();
				res.json_responses = {"statusCode" : 200};
				callback(null,res);
			}
			else{
				connection.close();
				logger.log("returned false");
				res.json_responses = {"statusCode" : 401};
				callback(null,res);
			}
		});
	});
};
exports.handle_request_getCxOrders = function(msg, callback){
	var res={};
	var json_responses;
	logger.log("In handle request:"+ msg.cx_email);
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('orders');
		process.nextTick(function(){
			coll.find({"cx_email":msg.cx_email}).toArray(function(err,rows){
				if(err){
					logger.log("returned false");
					connection.close();
					res.json_responses = {"statusCode" : 401};
					callback(null,res);
				}
				else{
					connection.close();
					res.json_responses={"status code":200,"products":rows,"session_owner":msg.session_owner};
					callback(null,res);	
				}	
			});
		});
	});
};