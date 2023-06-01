const consumers = require('../consumers');
const mqManager = require('./mqManager');

async function setupMqConnection() {
  await mqManager.connectChannel(consumers);
}

module.exports = {
  setupMqConnection,
};
