const { QUEUES, QUEUES_ACTIONS } = require('@appetism/binant-codetest-shared/src/config/constants');
const { orderService } = require('../services');
const mqManager = require('../queuesManager/mqManager');

const messageProcessor = async (content) => {
  const { action, payload } = content;

  switch (action) {
    case QUEUES_ACTIONS.ORDER.FIND_UPDATE_ORDER:
      return orderService.findAndUpdateOrder(payload.filter, payload.update);
    default:
      return null;
  }
};

const orderQueueConsumer = () => {
  mqManager.consumeAndRespond(QUEUES.ORDER, messageProcessor);
};

module.exports = orderQueueConsumer;
