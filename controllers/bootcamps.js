const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamps");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamps = require("../models/Bootcamps");

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  //copying the request query
    const reqQuery = {...req.query};
  //Fields to exclude
   const removeFields = ['select',"sort","page","limit"];

   //loop over removeFields and delete them from reqQuery
   removeFields.forEach(param=> delete reqQuery[param]);
   console.log(reqQuery,"...................")
  let query;
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`)

 
  query = Bootcamp.find(JSON.parse(queryStr))
  //  Select fields
  if(req.query.select){
    const fields = req.query.select.split(',').join(" ");
    query = query.select(fields)
  }
  //Sort
  if(req.query.sort){
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy)
  
  }
  else{
    query = query.sort('-createdAt')
  }
  //Pagination
  console.log(req.query.limit,".....?......")
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 2;
  const startIndex = (page-1) * limit;
  const endIndex = (page) * limit;
  const total = await Bootcamp.countDocuments();
  console.log(total,"///////////////////////////")
  console.log("limit",limit)
  query = query.skip(startIndex).limit(limit);
  console.log(query,"query")

  //Executing query
  const bootcamps = await query;

  //Pagination result

  const pagination = {};
  if(endIndex < total){
    pagination.next={
     page:page+1,
     limit
    }
  }
  if(startIndex > 0){
    pagination.prev={
      page:page-1,
      limit
    }
  }
  res.status(200).json({
    success: true,
    data: bootcamps,
    pagination,
    count: bootcamps.length,
  });
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
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id, req.body);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }
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
    success:true,
    count:bootcamp.length,
    results:bootcamp,
  })

  
});
