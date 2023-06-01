const QueuesManager = require('../utils/QueuesManager');
const { QUEUES, QUEUES_ACTIONS } = require('../config/constants');
const logger = require('../utils/logger');

class OrderProducer extends QueuesManager {
  constructor(channel) {
    if (!channel) {
      logger.error('OrderProducer: Channel is not set');
    }

    super(channel);
  }

  async findAndUpdateOrder(filter, update) {
    return this.sendAndReceive(QUEUES.ORDER, QUEUES_ACTIONS.ORDER.FIND_UPDATE_ORDER, { filter, update });
  }
}

module.exports = OrderProducer;
