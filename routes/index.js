var express = require('express');
var router = express.Router();

/* GET home page. */

const hbs = require('handlebars')
const client = require('../connection');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var nodemailer = require('nodemailer');

var mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '19027443g@gmail.com',
    pass: 'Testing1234!'
  }
});

router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Homepage',
	});
});

router.get('/chooseCloth', function(req, res, next) {
	//var clothArray;
	//const client = require('../connection');
	client.connect(err => {
	  	const collection = client.db("mydb").collection("cloth");
	  	collection.find().toArray(function(e,content){
	  		if (err) {
            	callback(err);
        	} else {
            	res.render('chooseCloth', { 
					title: 'Homepage',
					clothList: content 
				});
				//client.close();
			}			
        });	  	
	}); 	
});

router.post("/chooseColor", function(req, res, next) {
  	var cloth = req.body.cloth;

  	client.connect(err => {
	  	const collection = client.db("mydb").collection("color");
	  	collection.find({"cloth":cloth}).toArray(function(e,content){
	  		if (err) {
            	callback(err);
        	} else {
            	res.render('chooseColor', { 
                   		title: 'Cloth',
						colorList: content,
						cloth
				});
				//client.close();
			}	
         });
	});
});

router.post("/suggestions", function(req, res, next) {
	var color = req.body.color;
	var cloth = req.body.cloth;

	
	client.connect(err => {
	  	const collection = client.db("mydb").collection("matching");
		collection.aggregate([
	  		{ $match : 
	  			{ $or: [ 
	  				{ $and:[
	  					{"cloth1":cloth}, 
	  					{"color1":color}
	  				]}, 
	  				{ $and: [
	  					{"cloth2":cloth }, 
	  					{"color2":color }
	  					
	  				]}
	  			]}
	  		},
	  		{ $sample: { size: 2 } }
	  		
	  		]		
         ).toArray(function(e,content){
	  		if (err) {
            	callback(err);
        	} else {
        		console.log(content[0]);
            	res.render("suggestions", {
					title: "Suggestions",
					color,
					cloth,
					result : content[0],
					result2: content[1]
 				});
			}	
         });	
	});

});


router.get('/contact', function(req, res, next) {
	res.render('contact', { 
		title: 'Contact',
	});
});

router.post('/success', function(req, res, next) {
	var name = req.body.name
	var email = req.body.email;
	var subject = "Message from ".concat(name).concat(": ").concat(req.body.subject);
	var message = "From email :".concat(email).concat(": ").concat(req.body.message);
	var mailOptions = {
		from: email,
		to: '19027443g@gmail.com',
		subject: subject,
		html: message
	}
	mail.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        	res.render('success', { 
			title: 'Success',
			content: 'Success'
		});
      }
	});

});







/*router.get("/admin", function(req, res, next) {
	const client = require('../connection');
	client.connect(err => {
	  	const collection = client.db("mydb").collection("admin");
	  	var result = collection.find().toArray(function(e,docs){
	  		console.log(collection); 
	  		console.log(result); 
                   	res.render('testing', { 
                   		title: '1',
						colorList: docs 
				});
                   	client.close();
         });
	  // perform actions on the collection object
		
	});

});*/

module.exports = router;
