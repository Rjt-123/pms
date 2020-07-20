const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/pms', {useNewUrlParser:true, useCreateIndex:true});
var mongoosePaginate = require('mongoose-paginate');
var conn = mongoose.Collection;
var passSchema = new mongoose.Schema({
   password_category: {type:String,
       required: true,
       index: {
           unique:true,
       }},
       projet_names: {type:String,
        required: true,
       },

       password_detail: {type:String,
        required: true,
       },

   date: {
       type:Date,
       default:Date.now
      }
} );
passSchema.plugin(mongoosePaginate);
var passModel = mongoose.model('Password_Details',passSchema);
module.exports=passModel;
