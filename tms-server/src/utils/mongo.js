/**
 * Title: mongo.js
 * Author: Professor Krasso
 * Date: 8/4/23
 */
'use strict';

const { MongoClient } = require('mongodb');
const config = require('./config');

async function mongo(operations, next) {
  try {
    if (!config.dbUrl) {
      throw new Error('Set MONGODB_URI in tms-server/.env or in your environment.');
    }

    const client = new MongoClient(config.dbUrl, { serverSelectionTimeoutMS: 5000 });
    try {
      await client.connect();
      return await operations(client.db(config.dbname));
    } finally {
      await client.close();
    }
  } catch (error) {
    const databaseError = new Error('MongoDB operation failed.', { cause: error });
    databaseError.status = 500;
    next(databaseError);
  }
}

module.exports = { mongo };
