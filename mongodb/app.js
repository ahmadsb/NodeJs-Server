

const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');

const userRouter = require('./routers/userRoutes');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


// 1) GLOBAL MIDDLEWARES
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,// max number http request
    windowMs: 60 * 60 * 1000,//min. sec. msec.
    message: 'Too many requests fromt his IP, please try agin in an hour!'
});

app.use('/api',limiter);

app.use(express.json());
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;


app.use((req, res, next) =>{
    console.log(req.headers);
    next();
})

// server
app.get('/',(req,res)=>{
    res.writeHead(200);
    res.end('Hello from server side');
})
//routes
app.use('/api/v1/users',userRouter);

// handling unhandled routes
app.all('*',(req, res, next) =>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 404));
});
app.use(globalErrorHandler);



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