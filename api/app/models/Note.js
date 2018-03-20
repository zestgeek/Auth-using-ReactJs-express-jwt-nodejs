var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var NoteSchema   = new Schema({
	title: {
    	type : String,
	 	default : null	
    },
    description:  {
   	 	type: String,
   	 	default : null	
  	},
})



module.exports = mongoose.model('Note', NoteSchema);	