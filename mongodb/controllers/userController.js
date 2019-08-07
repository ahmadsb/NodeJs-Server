const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


// exports.aliasTopUsers = (req, res, next) =>{
//     req.query.limit = "5";
//     req.query.sort="-ahmad,email";
//     req.query.fields = "name,email,phone";
//     next();
// };

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

// exports.getUserStats = catchAsync(async (req, res, next)=>{
//         const stats = await User.aggregate(
//             [
//                 {
//                     $match:{ phone: { $gte:22}}
//                 },
//                 {
//                    $group:
//                    {
//                        _id: {$toUpper: '$name'},
//                        num: { $sum: 1 },
//                        avgPhone:{ $avg: '$phone'},
//                        minPhone:{ $min: '$phone'},
//                        maxPhone:{ $max: '$phone'},
                      
//                    }
//                 },
//                {
//                    $sort:{avgPhone : 1} ,
//                },
//                {
//                    $match:{_id: {$ne: 'EASY'}}
//                }
//             ]);

//             res.status(200).json({
//                 stats: 'success',
//                 data:{
//                     stats
//                 }
//             })

    
// });

// exports.getMonthlyPlan = catchAsync( async (req, res,next) =>{
//         const year = req.params.year * 1;
        
//         const plan = await User.aggregate([
//             {
//                 $unwind: '$startDates'
//             },
//             {
//                 $match: {
//                     startDates:{
//                         $gte: new Date(`${year}-01-01`),
//                         $lte: new Date(`${year}-12-31`)
//                     }
//                 }
//             },
//             {
//                 $group:{
//                     _id:{ $month: '$startDates'},
//                     numUserStarts:{ $add: 1},
//                     users:{ $push: '$name'}
//                 }
//             },
//             {
//                 $addFields: { month: '$_id'}
//             },
//             {
//                 $project:{
//                     _id: 0
//                 }
//             },
//             {
//                 $sort:{ numUsersStarts: -1}
//             }
//         ]);

//         res.status(200).json({
//             stats: 'success',
//             data:{
//                 plan
//             }
//         });

  
// });