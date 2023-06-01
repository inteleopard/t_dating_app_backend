const { QUEUES, QUEUES_ACTIONS } = require('@appetism/binant-codetest-shared/src/config/constants');
const { userService } = require('../services');
const mqManager = require('../queuesManager/mqManager');

const messageProcessor = async (content) => {
  const { action, payload } = content;

  switch (action) {
    case QUEUES_ACTIONS.USER.GET_BY_ID:
      return userService.getUserById(payload.userId);
    case QUEUES_ACTIONS.USER.UPDATE_BY_ID:
      return userService.updateUserById(payload.userId, payload.updateBody);
    default:
      return null;
  }
};

const userQueueConsumer = () => {
  mqManager.consumeAndRespond(QUEUES.USER, messageProcessor);
};

module.exports = userQueueConsumer;
