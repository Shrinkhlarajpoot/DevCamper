const ErrorResponse = require("../utils/errorResponse");

const asyncHandler = require("../middleware/async");
const User = require("../models/User");

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  console.log(name, email, password);
  const user = await User.create({ email, name, password, role });
  sendTokenResponse(user,200,res)
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse("Invalid credientials", 404));
  }
  const checkpassword = await user.matchPassword(password);
  if (!checkpassword) {
    return next(new ErrorResponse("Invalid credientials", 404));

  }
 sendTokenResponse(user,200,res)
});



// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
    });
  };

  // @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // user is already available in req due to the protect middleware
    const user = req.user;
  
    res.status(200).json({
      success: true,
      data: user,
    });
  });
//reset password
  exports.resetPassword = asyncHandler(async (req, res, next) => {
    // user is already available in req due to the protect middleware
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorResponse("There is no user with this email", 404));
    }
    //get reset token
    const resetToken = user.getResetPasswordToken()
    res.status(200).json({
      success: true,
      data: user,
    });
  });