/* eslint-disable no-param-reassign,import/no-unresolved */
const {
  config: { vars },
  utils: { logger, mongoConnect },
} = require('@appetism/binant-codetest-shared');
const app = require('./app');
const { setupMqConnection } = require('./queuesManager/utils');

async function main() {
  const { host, port, database, options } = vars.mongoose;

  await mongoConnect(`mongodb://${host}:${port}/${database}`, options);
  logger.info('Connected to MongoDB');

  const server = app.listen(vars.port, () => {
    logger.info(`Listening to port ${vars.port}`);
  });

  // Setup rabbitmq connection
  await setupMqConnection();

  // Setup Error handler
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

main().catch(logger.error);
