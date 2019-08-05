const fs = require('fs');
const crypto = require("crypto");

const start = Date.now();//millisec
// to Determinate number of threads on linux this command
const NUMBER_PROCESS = 2
process.env.UV_THREADPOOL_SIZE = NUMBER_PROCESS;
/* to Determinate number of thread on windows
 you have to set it before calling the script.
 set UV_THREADPOOL_SIZE=1 & node app.js */

setTimeout(()=> console.log("Timer1  Done"), 0);
setTimeout(()=> console.log("Direct1 Done"));

fs.readFile('example.txt',()=>{
    console.log('I/O Done');
    console.log('--------------------------');

    setTimeout(()=> console.log("Timer2 Done"), 0);
    setTimeout(()=> console.log("Timer3 Done"), 3000);
    setTimeout(()=> console.log("Direct2 Done"));
    process.nextTick(()=>console.log('Process.nextTick'));

    crypto.pbkdf2('password','salt', 100000, 1024,'sha512',()=>{
        console.log(Date.now() - start,"Password encrypted");
    });
    crypto.pbkdf2('password','salt', 100000, 1024,'sha512',()=>{
        console.log(Date.now() - start,"Password encrypted");
    });
    crypto.pbkdf2('password','salt', 100000, 1024,'sha512',()=>{
        console.log(Date.now() - start,"Password encrypted");
    });
    crypto.pbkdf2('password','salt', 100000, 1024,'sha512',()=>{
        console.log(Date.now() - start,"Password encrypted");
    });
  

});

console.log("Top level code");