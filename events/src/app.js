const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const {
  config: { vars, morgan },
  middlewares: {
    error: { errorConverter, errorHandler },
  },
  utils: { ApiError },
} = require('@appetism/binant-codetest-shared');
const jwtStrategy = require('./passportStrategies/jwtStrategy');
const routes = require('./routes/v1');

const app = express();

if (vars.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// This ensures the request IP matches the client and not the load-balancer
app.enable('trust proxy');

// Health check endpoint
app.get('/health', (req, res) => res.send('Healthy'));

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// Authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
