const mongoose = require('mongoose');
const dotenv= require('dotenv');
const User = require('./../models/userModel')
dotenv.config({path:'./config.env'})

//connect to DATABASE  
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useFindAndModify : true,
    useNewUrlParser : true,
    useFindAndModify : false,
}).then(con =>{
    // console.log(con.connections);
    console.log('DB connection successful!');
});

// READ JSON FILE
// const  users = JSON.parsefs.readFileSync('filename.json','utf-8'));

// IMPORT DATA INTO DB
const importData = async()=>{
    try{
        await User.create(users);
        console.log('Data successfully loaded!');
    }catch(err){
        console.log(err);
    }
    process.exit();// stop running

}

// DELETE ALL DATA FROM DB

const deleteData = async() =>{
    try{
        await User.deleteMany();
        console.log('Data successfully deleted!');
    }catch(err){
        console.log(err);
    }
    process.exit();// stop running

}

if( process.argv[2] === '--import')
{
    importData();
}else if (process.argv[2] === '--delete')
{
    deleteData();
}

/*
to run by cli
node data/imprt-data.js --import 
node data/imprt-data.js --delete 

*/