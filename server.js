const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const colors = require("colors")
 const connectDB = require("./config/db")
//Route files
//Load env vars
dotenv.config({path: "./config/config.env"});
const bootcamps = require("./routes/bootcamps")
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
//Mount routers

app.use('/api/v1/bootcamps',bootcamps)
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