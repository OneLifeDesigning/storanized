const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/storanized';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => console.info(`Successfully connected to the database ${MONGODB_URI}`))
  .catch(error => console.error(`An error ocurred trying to connect to de database ${MONGODB_URI}`, error));

process.on('SIGINT',  () => {
  mongoose.connection.close( () => {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});
