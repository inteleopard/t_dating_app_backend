const passport = require('passport');
const httpStatus = require('http-status');
const { ApiError } = require('@appetism/binant-codetest-shared/src/utils');
const { roleRights } = require('@appetism/binant-codetest-shared/src/config/roles');

const verifyCallback = (req, resolve, reject, requiredRights, predicate) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'token_invalid'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  if (predicate && typeof predicate === 'function') {
    if (!predicate(req)) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth =
  (requiredRights = [], predicate) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights, predicate))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
