
const logger = (req,res,next)=>{
    req.hello="hello World";
    console.log(`middleware run ${req.method} ${req.protocol} ${req.url}`);
    next();
}
module.exports = logger;