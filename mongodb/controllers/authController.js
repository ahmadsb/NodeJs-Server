const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

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

exports.protect = catchAsync(async (req, res, next) =>{
    // 1) Getting token and check of it's there
    let token;
    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.'));
    }

    // 2) certification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3) Check if user still exists    
    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        return next(new AppError('The token belonging to this user does no longer exist'),401);
    }
    
    // 4) Check if user changed password after the JWT was issued

    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password!'));
    }

    // GRANT ACCESS TO PRTECTED ROUTE
    req.user = freshUser;

    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(new 
                AppError('You do not have oermission to perform this action', 403));
        };
        next();
    };
    
};

exports.forgotPassword =catchAsync(async (req, res, next) =>{
    // 1) Get user based on POSted email
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new AppError('There is no user with email address.',404));
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordRestToken();
    await user.save({validateBeforeSave: false});
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
        )}/api/v1/users/resetPassword/${resetToken}`

    const message  = `Forgot your password? Submit a PATCH request with your new password and 
    passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this 
    email!`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token valid for 10 min',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return next(new AppError('There was an error sending the email. Try again later',
         500
         ));
    }
    
});

exports.resetPassword = catchAsync( async(req, res, next) =>{
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });
    // 2) If toen has not expired, and there is user, set the new password
    if(!user){
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user

    // 4) Log the user in, send JWT

    const token = signToken(user._id);
    res.status(200).json({
        status:'success',
        token
    });

});