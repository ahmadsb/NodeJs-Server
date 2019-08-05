

const express = require('express');
const app = express();
const userRouter = require('./routers/userRoutes');

//middleware
app.use(express.json());

// server
app.get('/',(req,res)=>{
    res.writeHead(200);
    res.end('Hello from server side');
})
//routes
app.use('/api/v1/users',userRouter);


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