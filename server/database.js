const mongoose=require('mongoose');
const user=mongoose.Schema({
email:{type:String,minlength:20,required:true,lowercase:true},
password:{type:String,minlength:12,maxlength:120,required:true},
token:{type:String,required:true},
date: { type: Date, default: Date.now }
});
const teacher=mongoose.Schema({
	staffId:{type:String,minlength:5,required:true,unique:true},
	staffname:{type:String,required:true}
});
const Teachers=mongoose.model('teachers',teacher);
const Users=mongoose.model('users',user);
exports.Teachers=Teachers
exports.Users=Users;
