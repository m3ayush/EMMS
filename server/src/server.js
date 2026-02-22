const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start();
