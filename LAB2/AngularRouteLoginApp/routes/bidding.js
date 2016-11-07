exports.test = function(req,res)
{
	console.log("Hey call is here");	
	res.render('bidding',{title:'bidding'});
}

