const express = require("express");
const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamps");

//Include other resourses routers

const {
  getBootcamps,
  getSingleBootcamps,
  deleteBootcamps,
  postBootcamps,
  putBootcamps,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const courseRouter = require("./courses");
const {protect ,authorize}= require("../middleware/auth")
router.use("/:bootcampId/courses", courseRouter);
router.route("/").get(advancedResults(Bootcamp,'courses'),getBootcamps).post(protect,authorize('publisher','admin'),postBootcamps);
router
  .route("/:id")
  .get(getSingleBootcamps)
  .put(protect,authorize('publisher','admin'),putBootcamps)
  .delete(protect,authorize('publisher','admin'),deleteBootcamps);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/:id/photo").put(protect,authorize('publisher','admin'),bootcampPhotoUpload);
// //create a route
// router.get("/",(req,res)=>{
//     res.status(200).json({success:false,msg:"show all the bootcamps"})
// })
// router.get("/:id",(req,res)=>{
//     res.status(200).json({success:false,msg:`Show bootcamp ${req.params.id}`})
// })
// router.post("/",(req,res)=>{
//     res.status(200).json({success:false,msg:"create new bootcamps"})
// })
// router.put("/:id",(req,res)=>{
//     res.status(200).json({success:false,msg:`Display bootcamp ${req.params.id}`})
// })
// router.delete("/:id",(req,res)=>{
//     res.status(200).json({success:false,msg:`Delete bootcamp ${req.params.id}`})
// })

//export the router
module.exports = router;
