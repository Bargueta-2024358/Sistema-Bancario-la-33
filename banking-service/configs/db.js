'use strict';

const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    mongoose.connection.on('error', () => {
      console.log('MongoDB | no se pudo conectar');
      mongoose.disconnect();
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB | conectado');
    });

    await mongoose.connect(process.env.URI_MONGODB, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
  } catch (error) {
    console.error(`Error al conectar la db: ${error}`);
    process.exit(1);
  }
};

module.exports = { dbConnection };
