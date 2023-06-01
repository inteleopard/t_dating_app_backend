/* eslint-disable no-param-reassign,import/no-unresolved */
const mongoConnect = require('@appetism/binant-codetest-shared/src/utils/mongoConnect');
const config = require('@appetism/binant-codetest-shared/src/config/vars');
const logger = require('@appetism/binant-codetest-shared/src/utils/logger');

const app = require('./app');
const mqManager = require('./queuesManager/mqManager');
const { setupMqConnection } = require('./queuesManager/utils');

async function main() {
  const { host, port, database, options } = config.mongoose;

  await mongoConnect(`mongodb://${host}:${port}/${database}`, options);
  logger.info('Connected to MongoDB');

  const server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
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

    if (mqManager) {
      mqManager.closeChannel();
    }
  });
}

main().catch(logger.error);
