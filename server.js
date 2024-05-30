const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./logger');

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

// Import the Express application
const app = require('./app');

// Construct MongoDB connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connect to MongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('DB connection successful'))
  .catch((err) => logger.error(`DB connection error: ${err}`));

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Listening on http://localhost:${port}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
