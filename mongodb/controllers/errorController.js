const AppError = require('./../utils/appError');
// const handleCastErrorDB = err =>{
//     const message = `Invalid ${err.path}: ${err.value}.`;
//     return new AppError(message, 404);
// };

const sendErrorDev = (err, res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack
    });
};

const handleJWTError = err=> new AppError('Incalid token, please log in again!', 401);

const sendErrorProd = (err, res) =>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('ERROR!! ', err)
        res.status(500).json({
            status:'error',
            message:'Something went very wrong!'
        });
    }
    
}
module.exports = (err, req, res,next) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.name === 'JsonWebToken')  error = handleJWTError(erro);
        sendErrorProd(err, res);
    }
 
};