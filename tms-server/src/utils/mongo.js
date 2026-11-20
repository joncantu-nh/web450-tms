/**
 * Title: mongo.js
 * Author: Professor Krasso
 * Date: 8/4/23
 */
'use strict';

const mongoose = require('mongoose');
const config = require('./config');

async function connectMongo() {
  if (!config.dbUrl) {
    throw new Error('Set MONGODB_URI in tms-server/.env or in your environment.');
  }

  await mongoose.connect(config.dbUrl, {
    dbName: config.dbname,
    serverSelectionTimeoutMS: 5000
  });
  return mongoose.connection;
}

async function mongo(operations, next) {
  try {
    const connection = await connectMongo();
    return await operations(connection.db);
  } catch (error) {
    const databaseError = new Error('MongoDB operation failed.', { cause: error });
    databaseError.status = 500;
    next(databaseError);
  }
}

module.exports = { mongo, connectMongo, disconnectMongo: () => mongoose.disconnect() };
