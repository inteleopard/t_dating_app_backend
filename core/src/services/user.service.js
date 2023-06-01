const httpStatus = require('http-status');
const _ = require('lodash');

const { User } = require('@appetism/binant-codetest-shared/src/models');
const ApiError = require('@appetism/binant-codetest-shared/src/utils/ApiError');
const { EventProducer } = require('@appetism/binant-codetest-shared/src/producers');

const mqManager = require('../queuesManager/mqManager');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const bodyToSave = userBody;

  if (await User.isEmailTaken(bodyToSave.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  return User.create(bodyToSave);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Object} options
 * @returns {Promise<User>}
 */
const getUserById = async (id, options = {}) => {
  return User.findById(id, {}, options);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  _.merge(user, updateBody);

  await user.save({ validateBeforeSave: false });
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Delete user and all his data by id
 * @param {ObjectId} userId
 * @returns {Promise<>}
 */
const deleteUserAndAllDataById = async (userId) => {
  const eventProducer = new EventProducer(mqManager.channel);

  await Promise.all([deleteUserById(userId), eventProducer.exitAllEvents(userId)]);
};

exports.createUser = createUser;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.updateUserById = updateUserById;
exports.deleteUserById = deleteUserById;
exports.deleteUserAndAllDataById = deleteUserAndAllDataById;
