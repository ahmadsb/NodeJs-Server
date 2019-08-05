const http = require('http');
const fs = require('fs');
const data = fs.readFileSync(`${__dirname}/input.txt`,'utf-8');
const url = require('url');

const server = http.createServer((req,res)=>{
    const {query, pathname} = url.parse(req.url,true);
    if(pathname === '/' || pathname === '/overview')
    {
        res.end("Welcome to overview page");
    }
    else if (pathname === '/product')
    {
        res.end("Welcome to product page");
    }
    if(pathname === '/api')
    {
        // console.log(query.id);
        res.writeHead(200);
        res.end(data);
    }
    else{
        res.writeHead(404);
        res.end("<h1> page not found </h1>");
    }
    // res.end("Weclome to server");
});

server.listen(8001,'127.0.0.1',()=>{
    const port = server.address().port
    const host = server.address().address
    console.log(`http://${host}:${port}`);
})

