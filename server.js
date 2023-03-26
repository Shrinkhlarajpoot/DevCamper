const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const colors = require("colors")
const fileupload = require("express-fileupload")
const cookieParser = require("cookie-parser")
 const connectDB = require("./config/db")
 const path = require("path")
//Route files
//Load env vars
dotenv.config({path: "./config/config.env"});
const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")
const auth = require("./routes/auth")
const errorHandler = require("./middleware/error")

//connect to DB
// connectDB()
connectDB()
//initilalize the app
const app = express();
//body parsel

app.use(express.json())
//dev logging middleware
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}
//file upload
app.use(fileupload())
app.use(cookieParser())

//set static folder
app.use(express.static(path.join(__dirname,'public')));
//Mount routers

app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/auth',auth)
app.use(errorHandler)


//run server
const PORT = process.env.PORT || 5000;
app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

//Hnadle unhandled promise rejection

process.on('unhandledRejection',(err,promise)=>{
    console.log(`ERROR:${err.message}`.red)
    
    //Close server & exit process

    server.close(()=>process.exit(1))
})