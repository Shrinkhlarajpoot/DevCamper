const express = require("express")
const dotenv = require("dotenv")

//Load env vars
dotenv.config({path: "./config/config.env"});

//initilalize the app
const app = express();

//run server
const PORT = process.env.PORT || 5000;
app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))