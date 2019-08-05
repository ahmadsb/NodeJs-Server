const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req,res)=>{
    // //solution 1 
    // fs.readFile('input.txt', (err,data) => {
    //     if(err) console.log(err);
    //     res.end(data);
    // });

    // //solution 2 : Streams send by chunks
    // const readable = fs.createReadStream('insput.txt');
    // readable.on('data',(chuck)=>{
    //     res.write(chuck);
    // });
    // readable.on('end',()=>{
    //     res.end();
    // });

    // readable.on('error', err =>{
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end("file not found!");
    // });

    //Solution 3 
    const readable = fs.createReadStream('input.txt');
    readable.pipe(res);
    //readableSource.pipe(writeableDest)

});

server.listen(8003,'127.0.0.1',()=>{
    console.log('Listening...');
});