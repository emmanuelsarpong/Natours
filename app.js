const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// CORS Configuration
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, // Only include if sending cookies/authentication with requests
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Enable pre-flight requests for all routes
app.options('*', cors());

// Serve static files from the 'public' directory
app.use(
  express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
      console.log(`Serving ${path}`); // Debugging: Log path of served static files
    },
  }),
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logs in development mode
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // More detailed logs in production mode
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
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

// Ignore .map files (if you don't want to expose them or handle them differently)
app.get('*.map', (req, res) => {
  res.status(404).send('Source map not available.'); // Custom handling for source map requests
});

// Import routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes'); // Ensure path is correct

// Route handlers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Test middleware for logging request time and routes
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`${req.method} ${req.url} at ${req.requestTime}`);
  next();
});

// Error handling for unmatched routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Use the global error handler from errorController
app.use(globalErrorHandler);

module.exports = app;
