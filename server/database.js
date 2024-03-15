const mongoose=require('mongoose');
const user=mongoose.Schema({
email:{type:String,minlength:20,required:true,lowercase:true},
password:{type:String,minlength:12,maxlength:120,required:true},
token:{type:String,required:true},
date: { type: Date, default: Date.now }
});
const Users=mongoose.model('users',user);
exports.Users=Users;