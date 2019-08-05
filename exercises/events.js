const EventEmitter = require('events');
const http = require('http');

class Persons extends EventEmitter{
    constructor(){
        super();
    }
}

const myEmitter = new Persons();

myEmitter.on('person',()=>{
    console.log('age person is 18');
});

myEmitter.on('person',()=>{
    console.log('age person is 18');
});

myEmitter.on('person',(age) =>{
    console.log(`age person is ${age}.`)
})
myEmitter.emit('person', 10);// any event name you want

/* ========== another example =========== */

const server = http.createServer();

server.on('request',(req,res) => {
    console.log('Request received');
    console.log(req.url);
    res.end('Request received');
});

server.on('request',(req,res) => {
    console.log('Another received');
});

server.on('close',() => {
    console.log('server closed');
});

server.listen(8002,'127.0.0.1',()=>{
    console.log('Waiting for requets...');
})