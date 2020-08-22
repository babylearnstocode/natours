const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errController');

//start express app
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
//GLOBAL MIDDLEWARE

//set security HTTP headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from the same IP
const limit = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests from this IP, please try again in an hour!',
});

// only to api routes
app.use('/api', limit);

// Body parse, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(
  express.urlencoded({ extended: true, limit: '10kb' })
);
app.use(cookieParser());

// Data santinization NOSQL query Injection
app.use(mongoSanitize());

// Data santinization against XSS
app.use(xss());

// parameter polution prevention
app.use(
  hpp({
    whilelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// 3) Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
