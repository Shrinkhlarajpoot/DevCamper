const fs = require("fs");
const mongoose = require("mongoose");
const color = require("colors");
const dotenv = require("dotenv");

//Load env vars

dotenv.config({ path: "./config/config.env" });


//Load models

const Bootcamp = require("./models/Bootcamps");
const Courses = require("./models/Courses");

//Connect to DB

mongoose.set('strictQuery', true);
console.log(process.env.MONGO_URI,"............")
mongoose.connect(process.env.MONGO_URI);

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//               // useCreateIndex:true,
//               // useFindAndModify:false,
//             useUnifiedTopology: true,
//           });
//         //...
//     }
//     catch(err){

//     }
// }
// connectDB()

//Read tie json fike
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamp.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
//Import into DB

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Courses.create(courses);
    console.log("data imported");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Courses.deleteMany();
    console.log("Data destroyed");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process?.argv[2] === "-i") {
  importData();
} else if (process?.argv[2] === "-d") {
  deleteData();
}
