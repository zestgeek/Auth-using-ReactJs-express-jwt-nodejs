var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};


var LoginSchema   = new Schema({
    username: {
    	type : String,
	 	required: 'Please provide the username'
    },
    password:  {
   	 	type: String,
   	 	required: 'Please provide the password'
  	},
  	confirm_password : {
  		type : String,
  		required : "Please provide the confirm password." ,
  		validate: [passwordConfirm, 'Password and confirm password ......']	
  	},
  	email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
});

// function that validate the password and confirm password
function passwordConfirm(value) {
  // `this` is the mongoose document
  return this.password == value;
}

module.exports = mongoose.model('Login', LoginSchema);
