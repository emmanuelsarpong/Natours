const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
app.use(cors());

// Set security HTTP headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: [
//           "'self'",
//           'https://api.mapbox.com',
//           "'unsafe-inline'",
//           'blob:',
//           'https://cdnjs.cloudflare.com',
//         ],
//         styleSrc: [
//           "'self'",
//           'https://api.mapbox.com',
//           'https://fonts.googleapis.com',
//           "'unsafe-inline'",
//         ],
//         imgSrc: ["'self'", 'data:', 'https://api.mapbox.com'],
//         connectSrc: [
//           "'self'",
//           'http://127.0.0.1:3000',
//           'https://api.mapbox.com',
//           'https://events.mapbox.com',
//         ],
//         fontSrc: [
//           "'self'",
//           'https://fonts.gstatic.com',
//           'https://fonts.googleapis.com',
//         ],
//         workerSrc: ["'self'", 'blob:'],
//         objectSrc: ["'none'"],
//         upgradeInsecureRequests: [],
//       },
//     },
//   }),
// );

// Example middleware to ignore requests for *.js.map
app.get('*.js.map', (req, res, next) => {
  console.log('Ignoring request for source map:', req.path);
  res.status(404).end(); // Respond with 404 Not Found for *.js.map requests
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Jonas',
  });
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Error handling for unmatched routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
