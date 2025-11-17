const mongoose = require('mongoose');
const app = require('./app');

// Load environment variables
require('dotenv').config({ path: './config.env' });

// Database connection
// const DB = process.env.DATABASE_LOCAL;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful! 🎉'))
  .catch((err) => console.error('DB Connection Error ❌', err));

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
