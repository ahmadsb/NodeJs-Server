const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ECPIRES_IN
    });
};

exports.signup = catchAsync(async(req, res, next) =>{
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
        stats: 'success',
        token,
        data:{
            user: newUser
        }
    });
});
 
exports.login = catchAsync( async (req, res, next) =>{
    const {email, password} = req.body;
    // 1) Check if email and password exist
    if(!email || !password){
        next(new AppError('Please, provide email and password!', 400));
    }
    
    // 2) Check  if user esists && password is correct
    const user = await User.findOne({email: email}).select('+password');
    // correct is true or false after 
    const correct = await user.correctPassword(password, user.password);
    if(!user || !correct){
        return next(new AppError('Incorrect email or password', 401));
    }
    // 3) If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
});