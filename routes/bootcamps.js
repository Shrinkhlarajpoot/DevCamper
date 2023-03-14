const express = require("express")
const router = express.Router();

const {getBootcamps,getSingleBootcamps,deleteBootcamps,postBootcamps,putBootcamps,getBootcampsInRadius} = require("../controllers/bootcamps")
router.route("/").get(getBootcamps).post(postBootcamps)
router.route("/:id").get(getSingleBootcamps).put(putBootcamps).delete(deleteBootcamps)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
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