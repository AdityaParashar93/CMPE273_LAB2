var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";

exports.calculate=function(req,res){
	console.log("Testing Calculator Call");
	var test=req.param("token_string");
	var temp='';
	var nums=[];
	var operators=[]
	var cnt1=0;
	var cnt2=0;
	console.log(test);
	for(var i=0;i<test.length;i++){
		if(test.charAt(i)=='+'){
			operators[cnt2]=''+test.charAt(i);
			temp='';
			cnt1++;
			cnt2++;
		}
		else if(test.charAt(i)=='-'){
			operators[cnt2]=''+test.charAt(i);
			temp='';
			cnt1++;
			cnt2++;
		}
		else if(test.charAt(i)=='*'){
			operators[cnt2]=''+test.charAt(i);
			temp='';
			cnt1++;
			cnt2++;
		}
		else if(test.charAt(i)=='/'){
			operators[cnt2]=''+test.charAt(i);
			temp='';
			cnt1++;
			cnt2++;
		}
		else{
			temp=temp+test.charAt(i);
			nums[cnt1]=temp;
		}
	}
	var result=Number(nums[0]);
	var j=Number(1);
	for(var i=0;i<nums.length;i++){
		if(operators[i]=='+'){
			result=result+parseInt(nums[j++]);
		}
		else if(operators[i]=='-'){
			result=result-parseInt(nums[j++]);
		}
		else if(operators[i]=='*'){
			result=result*parseInt(nums[j++]);
		}
		else if(operators[i]=='/'){
			result=result/parseInt(nums[j++]);
		}
	}
	console.log(result);
	var json_responses = {"result" : result};
	res.send(json_responses);
};

exports.getCalculator=function(req,res){
	res.render('calculator', { title: 'Calculator' });
}

