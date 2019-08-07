const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const crybto = require('crypto');

const userSchema = new mongoose.Schema({
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
    role:{
        type:String,
        enum:['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
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

userSchema.pre('save', async function(next){
    if(!this.isModified('password') || this.isNew) return next();
    
    this.passwordChangedAt = Date.now() - 1000;
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

userSchema.methods.createPasswordRestToken = function(){
    const resetToken = crybto.randomBytes(32).toString('hex');
    this.passwordResetToken = crybto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};
const User = mongoose.model('User',userSchema);

module.exports = User;