

const express = require('express');
const app = express();
const userRouter = require('./routers/userRoutes');
const morgan = require('morgan');


//middleware
if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));
}
app.use(express.json());

// server
app.get('/',(req,res)=>{
    res.writeHead(200);
    res.end('Hello from server side');
})
//routes
app.use('/api/v1/users',userRouter);

// handling unhandled routes
app.all('*',(req, res, next) =>{
    res.status(404).json({
        status:'fail',
        message: `Can't find ${req.originalUrl} on this server!!`
    });
});



module.exports = app;












//npm init to cerate 
//npm i slugify --save

/*
[working dirct]
    npm i nodemon --save-dev 
    npm i nodemon --global or sudo npm i nodempon --global
*/
/*
    npm outdated
    npm update slugify ^ --> ~
    npm uninstall slugify
    e.g
    Package  Current  Wanted  Latest  Location
    slugify    1.0.0   1.3.4   1.3.4  first-app

 */
//npm i express@4 
//npm i mongoose@5
/*
Extenions prettier format code
  TODO FIXME BUG
*/
// npm run start to run nodemon server.js
/*
to use file config.env
npm i dotenv --save
set up path by dotenv=require('dotenv').config({path:'./config.env})
*/