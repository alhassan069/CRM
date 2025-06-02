const loggerMiddleware = ((req,res,next) =>{
    req.time = new Date(Date.now()).toUTCString();
    console.log('\x1b[36m%s\x1b[0m',req.time, req.method,req.hostname, req.path);
    next();
});

module.exports = loggerMiddleware;