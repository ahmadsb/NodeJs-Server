const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // name:String, it's simple 
    name:{
        type:String,
        required: [true, 'must have a name'],
        unique:true
    },
    email:{
        type:String,
        required: [true, 'must have a email'],
        unique:true
    },
    phone:{
        type:Number,
        // default:4.5,
        required: [true, 'must have a phone number'],
        unique:true
    }, 
});
const User = mongoose.model('User',userSchema);

module.exports = User;