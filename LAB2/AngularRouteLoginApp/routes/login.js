/**
 * New node file
 */
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
var bcrypt=require('bcrypt-nodejs');
var passport = require('passport');
var mq_client = require('../rpc/client');
//require('./routes/passport')(passport);

exports.checkLogin = function(req,res,next){
	// These two variables come from the form on
	// the views/login.hbs page
	var username = req.param("username");
	var password = req.param("password");
	logger.log(username+"\t"+password);
	logger.log('info', "Basic:: " + username+"\t"+password);
	
	req.session.username=req.param("username");
	logger.log("\nsession data "+req.session.username);
	var msg_payload = {"username":username,"password":password};
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
};

exports.fetchProducts=function(req,res,next){
	var user=req.session.username;
	var rows;
	var seller="EBay";
	var msg_payload = {"product_category":req.param("category"),"product_seller":seller};
	mq_client.make_request('fetchProducts_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
};
exports.fetchProducts_nb=function(req,res){
	var msg_payload = {"product_condi":"old_nb"};
	mq_client.make_request('fetchProducts_nb_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
};
exports.fetchProducts_b=function(req,res){
	var msg_payload = {"product_condi":"old_b"};
	mq_client.make_request('fetchProducts_b_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
};
exports.fetchProducts_all=function(req,res){
	var msg_payload = {"product_seller":"EBay"};
	mq_client.make_request('fetchProducts_all_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
};
exports.getCxProducts=function(req,res){
	var msg_payload = {"product_seller":req.param("session_owner")};
	mq_client.make_request('getCxProducts_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
};
exports.addToCart=function(req,res){
	logger.log(req.param("product_id"));
	logger.log(req.param("test"));
	req.session.username=req.param("session_owner");
	logger.log(req.param("session_owner"));
	logger.log(req.param("product_id"));
	var msg_payload = {"cx_email":req.param("session_owner"),"product_id":req.param("product_id")};
	mq_client.make_request('addToCart_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
};
exports.showCart=function(req,res){
	logger.log(req.param("session_owner"));
	var json_responses;
	var result;
	var final_result=[];
	var ids=[];
	var msg_payload = {"cx_email":req.param("session_owner")};
	mq_client.make_request('showCart_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
};
exports.removeFromCart=function(req,res)
{
	logger.log(req.param("product_id"));
	logger.log(req.param("test"));
	req.session.username=req.param("session_owner");
	logger.log(req.session.username);
	var msg_payload = {cx_email:req.param("session_owner"),product_id:req.param("product_id")};
	mq_client.make_request('removeFromCart_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
};
exports.checkout=function(req,res){
	logger.log(req.param("session_owner"));
	var sum=req.param("order_total");
	logger.log(sum);
	var json_responses;
	var ids=[];
	var result=[];
	var msg_payload = {cx_email:req.param("session_owner"),order_total:req.param("order_total")};
	mq_client.make_request('checkout_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
	
};
exports.add_product=function(req,res){
	var json_responses;
	var msg_payload = {"product_name":req.param("product_name"),"product_seller":req.param("session_owner"),"product_value":req.param("product_price"),"product_inventory":req.param("product_quantity"),"product_desc":req.param("product_desc"),"product_condi":req.param("product_condi"),"product_category":req.param("product_category")};
	mq_client.make_request('addProduct_queue',msg_payload, function(err,results){
		logger.log("hey we got the response");
		logger.log(results);
		res.send(results.json_responses);
	});
};
exports.getCxOrders=function(req,res){
	logger.log(new Date().getDay());
	logger.log(req.param("session_owner"));
	var msg_payload = {"cx_email":req.param("session_owner")};
	mq_client.make_request('getCxOrders_queue',msg_payload, function(err,results){
		logger.log("hey we got the response for Cx Products");
		logger.log(results);
		res.send(results.json_responses);
	});
};
exports.redirectToHomepage = function(req,res)
{
	//Checks before redirecting whether the session is valid
	/*if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{username:req.session.username});
	}
	else
	{*/
		res.redirect('/');
	//}
};




















exports.place_bid=function(req,res){
	var mongo1 = require('mongodb');
	var o_id = new mongo1.ObjectID(req.param("id"));
	logger.log(req.param("session_owner"));
	var json_responses;
	
	mongo.connect(mongoURL,function(connection){
		logger.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('products');
			coll.find({"_id":o_id}).toArray(function(err,rows){
				if(err){
					logger.log("returned false");
					connection.close();
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
				else{
					logger.log(rows);
					if((((rows[0].product_date)-(new Date().getDay()))>=4) || ((new Date().getDay()-rows[0].product_date)<=3)){
						coll.update({"_id":o_id},
						{$set : {"product_value":req.param("bid_value"),"product_owner":req.param("session_owner")}},
						{upsert:false,multi:true},function(err,rows){
						if(err){
							logger.log("could not place bid");
							connection.close();
							json_responses = {"statusCode" : 401};
							res.send(json_responses);
						}
						else{
							if(rows){
								logger.log(rows);
								logger.log("your bid was placed");
								connection.close();
								json_responses={"status code":200};
								res.send(json_responses);
							}
							else{
								logger.log("could not place bid");
								connection.close();
								json_responses = {"statusCode" : 401};
								res.send(json_responses);
							}
						}	
					});
				}
				else{
					logger.log("could not place bid");
					connection.close();
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
			}	
		});
	});	
};
//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};