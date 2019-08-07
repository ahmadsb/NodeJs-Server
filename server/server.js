
const app = require('./app');
require('./data/import-data');//connect to DB 



const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
});