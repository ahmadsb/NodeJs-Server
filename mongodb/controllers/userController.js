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


// // test the model
// const testUser = new User({
//     name:'sabbah',
//     email:'admin@gmail.com',
//     phone:8272832
// });
// testUser.save().then(doc=>{
//     console.log(doc);
// }).catch(err=>{
//     console.log('ERROR :', err)
// });