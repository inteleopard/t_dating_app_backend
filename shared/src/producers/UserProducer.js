const QueuesManager = require('../utils/QueuesManager');
const { QUEUES, QUEUES_ACTIONS } = require('../config/constants');
const logger = require('../utils/logger');

class UserProducer extends QueuesManager {
  constructor(channel) {
    if (!channel) {
      logger.error('UserProducer: Channel is not set');
    }

    super(channel);
  }

  async getUserById(id) {
    return this.sendAndReceive(QUEUES.USER, QUEUES_ACTIONS.USER.GET_BY_ID, { userId: id });
  }

  async updateUserById(id, updateBody) {
    return this.sendAndReceive(QUEUES.USER, QUEUES_ACTIONS.USER.UPDATE_BY_ID, { userId: id, updateBody });
  }
}

module.exports = UserProducer;
