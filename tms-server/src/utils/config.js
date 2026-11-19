/**
 * Title: config.js
 * Author: Professor Krasso
 * Date: 8/4/23
 */

'use strict';

const { existsSync } = require('node:fs');
const { resolve } = require('node:path');

const envFile = resolve(__dirname, '../../.env');
if (!process.env.MONGODB_URI && existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

module.exports = {
  port: 3000,
  dbUrl: process.env.MONGODB_URI,
  dbname: 'tms',
};
