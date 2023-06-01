const httpStatus = require('http-status');
const ApiError = require('@appetism/binant-codetest-shared/src/utils/ApiError');
const catchAsync = require('@appetism/binant-codetest-shared/src/utils/catchAsync');
const { userService } = require('../services');

const getCurrentUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.send(user);
});

const updateMe = catchAsync(async (req, res) => {
  await userService.updateUserById(req.user.id, req.body);
  res.status(httpStatus.OK).send();
});

const deleteMe = catchAsync(async (req, res) => {
  await userService.deleteUserAndAllDataById(req.user.id);
  res.status(httpStatus.OK).send();
});

module.exports = {
  getCurrentUser,
  updateMe,
  deleteMe,
};
