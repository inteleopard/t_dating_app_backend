const { QUEUES, QUEUES_ACTIONS } = require('@appetism/binant-codetest-shared/src/config/constants');
const mqManager = require('../queuesManager/mqManager');
const eventService = require('../services/event.service');

const messageProcessor = async (content) => {
  const { action, payload } = content;

  switch (action) {
    case QUEUES_ACTIONS.EVENT.EXIT_ALL_EVENTS:
      return eventService.exitAllEvents(payload.userId);
    default:
      return null;
  }
};

const eventConsumer = () => {
  mqManager.consumeAndRespond(QUEUES.EVENT, messageProcessor);
};

module.exports = eventConsumer;
