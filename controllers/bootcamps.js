const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamps");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamps = require("../models/Bootcamps");
const path = require("path");

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getSingleBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});
exports.postBootcamps = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const publishedBootcamp = Bootcamp.findOne({user:req.user.id})
  if(publishedBootcamp && req.user.role!=="admin"){
    return next(new ErrorResponse("Cannot upload more than 1 bootcamp if not user",400))
  }
  const bootcamp = await Bootcamp.create(req.body);
 
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});
exports.putBootcamps = asyncHandler(async (req, res, next) => {
let bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  //Make sure that the user isnownber
  if(bootcamp.user.toString() !== req.user.id && req.user.role!=="admin"){
    return next(
      new ErrorResponse(`user with this ${req.params.id} cannot authorize this route` , 401)
    );
  }
 bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
  new:true,
  runValidators:true
 })
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id, req.body);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

   //Make sure that the user isnownber
   if(bootcamp.user.toString() !== req.user.id && req.user.role!=="admin"){
    return next(
      new ErrorResponse(`user with this ${req.params.id} cannot authorize this route` , 401)
    );
  }
  bootcamp.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder

  const loc = await geocoder.geocode(zipcode);
  //   console.log(loc,"....................")
  const lat = parseInt(loc[0].latitude);
  const lng = parseInt(loc[0].longitude);

  // Divide by the radius of the earth

  const radius = distance / 3963;
  const bootcamp = await Bootcamps.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamp.length,
    results: bootcamp,
  });
});

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id, req.body);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse("please upload file", 400));
  }
  const file = req.files.file;
  //Make sure image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload a image file", 400));
  }
  //check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a image file less than ${process.env.MAX_FILE_UPLOAD} `,
        400
      )
    );
  }
  //creat custom filrname
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }
     //Make sure that the user isnownber
   if(bootcamp.user.toString() !== req.user.id && req.user.role!=="admin"){
    return next(
      new ErrorResponse(`user with this ${req.user.id} cannot authorize this route` , 401)
    );
  }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    re.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
