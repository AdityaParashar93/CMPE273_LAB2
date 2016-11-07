var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt=require('bcrypt-nodejs');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
exports.registeruser=function(req,res) {
	//var hash = bcrypt.hashSync(req.param("password"));
	var json_responses;
	mongo.connect(mongoURL,function(){
		console.log("Connected to mongo at:"+mongoURL);
		var coll=mongo.collection('userinfo');
		
		coll.insert({cx_firstname:req.param("first_name"),cx_lastname:req.param("last_name"),cx_display:req.param("display_name"),cx_email:req.param("email"),cx_password:req.param("password")},function(err,user){
			if(user){
				req.session.username=user.cx_email;
				req.session.display_name=user.cx_display_name;
				console.log(req.session.display+" is in session");
				console.log("data inserted successfully");
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
			}
			else{
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
		
	
	/*mysql.fetchData(function(err,results){
		if(err){
			console.log("Invalid Login");
			console.log(err);
			json_responses = {"statusCode" : 401};
		    res.send(json_responses);		    
			throw err;
			
		}
		else 
		{
				console.log("valid Login");
				json_responses = {"statusCode" : 200};
	    		res.send(json_responses);
		}
	},getUser);*/
	});
};
exports.test = function(req,res)
{
	console.log("Hey call is here");	
	res.render('register',{title:'Register'});
};