var express = require('express');
var jwt = require('jsonwebtoken');
var path = require('path')
var app = express();
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/loginapi',{  useMongoClient: true});
mongoose.Promise = global.Promise;

var Login = require('./app/models/Login');
var Notes = require('./app/models/Note');
var config = require('./config');
var bodyParser = require('body-parser');
var empty  = require('is-empty');

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

app.set('superSecret',config.secret);

var port = process.env.PORT || 3003;

var router = express.Router();

app.use(express.static(path.join(__dirname, 'dist')))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.route('/register/')
	.post(function(req, res) {
		console.log(req.body)
		var login = new Login();
		Login.findOne({"username": req.body.username}, function(err, user_data){
			if(err){
				console.log(err)
			}
			if(user_data){
				return res.json({
					status : 400,
					message : "User already exist"
				});
			}
			
			login.username = req.body.username;
			login.password = req.body.password;
			login.confirm_password = req.body.confirm_password;
			login.email	   = req.body.email;
			
			login.save(function(err, login_data){
				if(err)
					return res.status(400).send(err);
				res.json({
					status: 200,
					message : 'You have succesfully registered.'
				});
			});
		});
	});

router.route('/login')
	.post(function(req, res){
		Login.findOne({"username": req.body.username, "password": req.body.password}, function(err, user_data){
			if(err || !user_data){
				return res.status(401).json({
					status : 401,
					message : "Invalid username and password.",
				});
			} else {
				const payload = {
      				username: user_data.username
    			};
    			var token = jwt.sign(payload, app.get('superSecret'), {
          			expiresIn : 60*60*24 // expires in 24 hours
    			});
				res.status(200).json({
					message : "You have succesfully loggedin.",
					token	: token
				});
			}
		});
	});
router.route('/note/add')
	.post(function(req, res) {
        var note = new Notes(req.body)
        note.save(function (err) {
        	if (err) {
        		return res.status(500).end()
        	} else {
        		return res.status(200).json({msg: 'note added'})	
        	}	
        })

 	});

 router.route('/note/update/:id')
 	.put(function(req, res){
		Notes.update({_id: req.params.id}, {$set: {title : req.body.title, description : req.body.description}}).exec((err, note) => {
		if (err) {
			console.log(err)
			return res.status(501).json({
				message: err
			})
		} else {
			return res.status(200).json({msg: 'note updated'})
		}
		})
 	})	

 router.route('/note/delete/:id')
 	.delete(function(req, res){
		Notes.remove({_id: req.params.id}).exec((err, note) => {
		if (err) {
			console.log(err)
			return res.status(501).json({
				message: err
			})
		} else {
			return res.status(200).json({msg: 'note removed'})
		}
		})
 	})
 router.route('/note/list')
 	.get(function(req, res){
  Notes.find({}).exec(function (err, note) {
    if (err) {
      return res.status(401).json({
        message: err
      })
    } else {
      return res.json(note)
    }
  })
})		
router.use(function(req,res,next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token){
    jwt.verify(token, app.get('superSecret'), function(err,decoded){
      if(err){
		return res.json({status : 403,success:false, message:'Failed to authenticate token.'});
      } else {
		req.decoded = decoded;
		next();
      }
    });
  } else {
    return res.json({
      status : 403,	
      success: false,
      message: 'No token provided.'
    });
  }
});

router.route('/result')
	.get(function(req, res) {
        Login.find(function(err, logins) {
            if (err)
                res.send(err);

            res.json(logins);
        });
 	});



app.use('/api',router);
app.get('/*', function(req, res){
  res.sendFile('/dist/index.html' ,{root:__dirname});
});
app.listen(port);
