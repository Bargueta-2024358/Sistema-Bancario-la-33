const mongoose = require('mongoose');

const dbConnection = async () => {
  const uri = process.env.URI_MONGODB;
  if (!uri) {
    throw new Error('URI_MONGODB no está definida');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB | conectado a notificaciones');
};

module.exports = { dbConnection };
