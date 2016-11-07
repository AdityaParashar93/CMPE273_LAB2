
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path');

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/ebay";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");
var login = require("./routes/login");
var register=require("./routes/register");
var index=require("./routes/index");
var products=require("./routes/products");
var cart=require("./routes/cart");
var contactus=require("./routes/contactus");
var checkout=require("./routes/checkout");
var payment_success=require("./routes/payment_success");
var sell_product=require("./routes/sell_product");
var calculator=require("./routes/calculator");
var bidding=require("./routes/bidding");
var passport = require('passport');
require('./routes/passport')(passport);

//var session = require('client-sessions');

var app = express();

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressSession({
	secret: 'CMPE273_passport',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(passport.initialize());

//development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

//GET Requests
app.get('/', routes.index);
app.get('/index',index.re);
app.get('/users', user.list);
app.get('/login',login.redirectToHomepage);
app.get('/homepage',login.redirectToHomepage);
app.get('/register',register.test);
app.get('/products',index.re);
app.get('/cart',index.re);
app.get('/contactus',index.re);
app.get('/checkout',index.re);
app.get('/payment_success',index.re);
app.get('/sell_product',index.re);
app.get('/cx_info',index.re);
app.get('/cx_orders',index.re);
app.get('/cx_products',index.re);
app.get('/bidding',index.re);

//POST Requests
app.post('/checklogin', login.checkLogin);
app.post('/fetchProducts', login.fetchProducts);
app.post('/registeruser', register.registeruser);
app.post('/addToCart',login.addToCart);
app.post('/showCart',login.showCart);
app.post('/removeFromCart',login.removeFromCart);
app.post('/checkout',login.checkout);
app.post('/add_product',login.add_product);
app.post('/fetchProducts_nb', login.fetchProducts_nb);
app.post('/fetchProducts_b', login.fetchProducts_b);
app.post('/fetchProducts_all', login.fetchProducts_all);
app.post('/getCxOrders',login.getCxOrders);
app.post('/getCxProducts',login.getCxProducts);
app.post('/logout', login.logout);
app.post('/place_bid',login.place_bid);

app.get('/calculator',calculator.getCalculator);
app.post('/calculate',calculator.calculate);

//
var mongo1 = require("./routes/mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
function close_bid() {
	var json_responses;
	mongo1.connect(mongoURL,function(connection){
		console.log("Connected to mongo at:"+mongoURL);
		var coll=mongo1.collection('products');
		//console.log(req.param("category"));
		process.nextTick(function(){
			coll.find({"product_condi":"old_b"}).toArray(function(err,rows){
				if(err){
					connection.close();
				}
				else{
					//connection.close();
					rows.forEach(function(element){
						if((((element.product_date)-(new Date().getDay()))<=4) || ((new Date().getDay()-element.product_date)>=3)){
							console.log("bidding has ended");
							var coll=mongo.collection('orders');
							var json_responses;
							coll.insert({cx_email:element.product_owner,order_total:element.product_value},function(err,user){
								if(user){
									console.log("bid was won by "+element.product_owner+" at the price of "+element.product_value+" for product id "+element._id);
									var coll=mongo.collection('products');
									var mongo1 = require('mongodb');
									var o_id = new mongo1.ObjectID(element._id);
									coll.remove({"_id":o_id},function(err,result){
										if(result){
											console.log(o_id+" was removed");
										}
										else{
											console.log(o_id+" was not removed");
										}
									});
								}
								else{
									console.log(element._id+" not found");
								}
							});
						}
						else
						{
							console.log("bidding is still on");
							console.log(element);
						}
					});
				}
			});
		});
	});
	}
setInterval(close_bid, (1000*60*60*12));
//connect to the mongo collection session and then createServer
    mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
 });	