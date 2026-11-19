const config = require('../src/utils/config');
const { mongo } = require('../src/utils/mongo');

mongo(async (db) => {
  await db.command({ ping: 1 });
  console.log(`MongoDB connection verified for ${db.databaseName}.`);
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  console.log('Collections:', collections.map(({ name }) => name).sort());
}, (error) => {
  // Driver errors can include sensitive connection details.
  console.error(config.dbUrl
    ? `MongoDB check failed (${error.cause.name}). Check the URI, database user, and Atlas IP access list.`
    : error.cause.message);
  process.exitCode = 1;
});
