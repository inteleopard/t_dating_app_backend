const QueuesManager = require('../utils/QueuesManager');
const { QUEUES, QUEUES_ACTIONS } = require('../config/constants');
const logger = require('../utils/logger');

class EventProducer extends QueuesManager {
  constructor(channel) {
    if (!channel) {
      logger.error('EventProducer: Channel is not set');
    }

    super(channel);
  }

  async exitAllEvents(userId) {
    return this.sendAndReceive(QUEUES.EVENT, QUEUES_ACTIONS.EVENT.EXIT_ALL_EVENTS, { userId });
  }
}

module.exports = EventProducer;
