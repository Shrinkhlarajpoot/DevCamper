const express = require("express")
const advancedResults = require("../middleware/advancedResults");
const Course = require("../models/Courses");
const {protect,authorize} = require("../middleware/auth")
const {getCourses,getSingleCourse,addCourse, updateCourse, deleteCourse} = require("../controllers/courses")
const router = express.Router({mergeParams:true});
router.route("/").get( 
  advancedResults(Course,{
    path:"bootcamp",
    select:'name description'
  }),getCourses).post(protect,authorize('publisher','admin'),addCourse)

router.route("/:id").get(getSingleCourse).put(protect,authorize('publisher','admin'),updateCourse).delete(protect,authorize('publisher','admin'),deleteCourse)

module.exports = router;