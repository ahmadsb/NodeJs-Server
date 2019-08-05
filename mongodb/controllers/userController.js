const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopUsers = (req, res, next) =>{
    req.query.limit = "5";
    req.query.sort="-ahmad,email";
    req.query.fields = "name,email,phone";
    next();
};


exports.getAllUsers = async (req, res ) =>{
    try{  
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
    } catch(err){
            res.status(404).json({ 
                status:'fail',
                message:err
            });
    }
  
};

exports.createUser = async (req, res ) =>{

    // const newUser = new User({});
    // newUser.save();
    /*
    if see error in await 
    in file package.json add
    ,"engines": {
        "node":">=10.0.0"
    } 
    */
   try{
    const newUser = await User.create(req.body);// returns promise
    res.status(201).json({
         status: 'success',
        data:{
            user:newUser
        }
    });
   }catch(err){
    res.status(400).json({
        status:'fail',
        message:'Invalid data sent!'
    })
   }
   
};


exports.getUser = async(req, res ) =>{
   try{
        const user = await User.findById(req.params.id);
        // User.findOne({ _id: req.params.id}) same thing
        res.status(200).json({
            status:'success',
            data:{
                user
            }
        })
   }catch(err){
    res.status(404).json({ 
        status:'fail',
        message:err
    });
   }
};

// update = patch
exports.updateUser = async(req, res ) =>{
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators: true
        });
        res.status(200).json({
            status:'success',
            data:{
                user
            }
        })
   }catch(err){
    res.status(404).json({ 
        status:'fail',
        message:err
    });
   }
};

exports.deleteUser = async(req, res ) =>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status:'success',
            data:null
        })
   }catch(err){
    res.status(404).json({ 
        status:'fail',
        message:err
    });
   }
};

exports.getUserStats = async (req, res, nex)=>{
    try{
        const stats = await User.aggregate(
            [
                {
                    $match:{ phone: { $gte:22}}
                },
                {
                   $group:
                   {
                       _id: {$toUpper: '$name'},
                       num: { $sum: 1 },
                       avgPhone:{ $avg: '$phone'},
                       minPhone:{ $min: '$phone'},
                       maxPhone:{ $max: '$phone'},
                      
                   }
                },
               {
                   $sort:{avgPhone : 1} ,
               },
               {
                   $match:{_id: {$ne: 'EASY'}}
               }
            ]);

            res.status(200).json({
                stats: 'success',
                data:{
                    stats
                }
            })

    }catch(err){
        res.status(404).json({
            status:'fail',
            message: err
        });
    }
}

exports.getMonthlyPlan = async (req, res) =>{
    try{
        const year = req.params.year * 1;
        
        const plan = await User.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id:{ $month: '$startDates'},
                    numUserStarts:{ $add: 1},
                    users:{ $push: '$name'}
                }
            },
            {
                $addFields: { month: '$_id'}
            },
            {
                $project:{
                    _id: 0
                }
            },
            {
                $sort:{ numUsersStarts: -1}
            }
        ]);

        res.status(200).json({
            stats: 'success',
            data:{
                plan
            }
        });

    }catch(err)
    {
        res.status(404).json({
            status:'fail',
            message: err
        });
    }
}