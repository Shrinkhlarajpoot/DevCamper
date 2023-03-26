const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Courses");
const Bootcamp = require("../models/Bootcamps");

//Get courses    /api/v1/courses
//  /api/v1/bootcamps/:bootcampId/courses

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  let query;
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse("No Course with the id"), 404);
  }
  res.status(200).json({
    success: true,
    count: course.length,
    data: course,
  });
});

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    //Make sure that the user isnownber
    if(bootcamp.user.toString() !== req.user.id && req.user.role!=="admin"){
      return next(
        new ErrorResponse(`user with this ${req.user.id} cannot authorize to add cpurse` , 401)
      );
    }
  if (!bootcamp) {
    return next( 
      new ErrorResponse(`No Bootcamp with the id ${req.params.bootcampId}`),
      404
    );
  }
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    count: course.length,
    data: course,
  });
});
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id ${req.params.id}`),
      404
    );
  }
  if(bootcamp.user.toString() !== req.user.id && req.user.role!=="admin"){
    return next(
      new ErrorResponse(`user with this ${req.user.id} cannot authorize to add cpurse` , 401)
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    count: course.length,
    data: course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id, req.body);
  if (!course) {
    return next(
      new ErrorResponse(`course not found with id ${req.params.id}`, 404)
    );
  }
  if(bootcamp.user.toString() !== req.user.id && req.user.role!=="admin"){
    return next(
      new ErrorResponse(`user with this ${req.user.id} cannot authorize to add cpurse` , 401)
    );
  }
  course.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
