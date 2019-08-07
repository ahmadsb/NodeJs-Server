const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
    // name:String, it's simple 
    name:{
        type:String,
        required: [true, 'Please, tell us your name!'],
    },
    email:{
        type:String,
        required: [true, 'Please, provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, 'Please, provide a valid email']
    },
    phone:{
        type:String,
        required: [true, 'Please, provide your phone number'],
        unique:true,
        validator: function(v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
          }
    },
    photo: String,
    password:{
        type: String,
        required:[true, 'Please, provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required:[true, 'Please, confirm your password'],
        //This only works on CREATE and SAVE
        validate:{
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date
});

//to hash the password
userSchema.pre('save', async function(next){
    //only run this function if password was actually modified
    if(!this.isModified('password'))
        return next();
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);// returns a promise
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

                   
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    let changedTimestamp;
    
    if(this.passwordChangedAt){
        changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000);
        console.log(changedTimestamp, JWTTimestamp);

    }
    return JWTTimestamp < changedTimestamp;
};

const User = mongoose.model('User',userSchema);

module.exports = User;