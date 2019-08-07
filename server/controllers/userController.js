const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allwoedFields) =>{
    let newObj = {};
    Object.keys(obj).forEach(el =>{
        if(allwoedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res,next) =>{

        // EXECUTE QUERY
        const features = new APIFeatures(User.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pageinate();

        const users = await features.query;
        
        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: users.length,
            data:{
                users//users:users same thing
            }
        });

  
});


exports.createUser = catchAsync(async (req, res , next) =>{
    const newUser = await User.create(req.body);// returns promise
    res.status(201).json({
         status: 'success',
        data:{
            user:newUser
        }
    });
   
});

exports.updateMe =  catchAsync(async (req, res, next) =>{
    // 1) Create error if user POSTs password data
    if( req.body.password || req.body.passwordConfirm){
        return next(
            new AppError(
                'this route is not for password update. Please user /updateMyPassword',
                400
            )
        );
    }
    // 2) filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'role');
    
    // 3)Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody,{
        new:true,
        runValidators: true
    });

    res.status(200).json({
        status:'success',
        user:updatedUser
    })
});

exports.deleteMe = catchAsync(async (req, res, next) =>{
    console.log(req.body,'asdasdasd');
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status:'success',
        data: null
    });
});

exports.getUser = catchAsync(async(req, res,next ) =>{
        const user = await User.findById(req.params.id);
        // User.findOne({ _id: req.params.id}) same thing
        if(!user)
        {
            return next(new AppError('No user found with that ID', 404));
        }
        res.status(200).json({
            status:'success',
            data:{
                user
            }
        });
});

// update = patch
exports.updateUser = catchAsync(async(req, res,next ) =>{
        const user = await User.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators: true
        });
        res.status(200).json({
            status:'success',
            data:{
                user
            }
        });
   
});

exports.deleteUser = catchAsync(async(req, res,next ) =>{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user)
        {
            return next(new AppError('No user found with that ID', 404));
        }

        res.status(200).json({
            status:'success',
            data:null
        })
  
});
