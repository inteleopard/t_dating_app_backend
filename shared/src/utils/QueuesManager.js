const amqp = require('amqplib');
const { v4: uuid } = require('uuid');
const { rabbitmq } = require('../config/vars');
const logger = require('./logger');

class QueuesManager {
  constructor(channel) {
    this.channel = channel;
  }

  getOrCreateChannel() {
    return new Promise((resolve, reject) => {
      if (this.channel) {
        resolve(this.channel);
      } else {
        this.connectChannel()
          .then(() => {
            resolve(this.channel);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

  async connectChannel(consumers = []) {
    try {
      const connection = await amqp.connect(rabbitmq.url);
      connection.on('error', (err) => {
        logger.error(`RabbitMQ connection error: ${err}`);
        setTimeout(() => this.connectChannel(consumers), 5000);
      });

      connection.on('close', () => {
        logger.error('RabbitMQ connection closed');
        setTimeout(() => this.connectChannel(consumers), 5000);
      });

      this.channel = await connection.createChannel();
      logger.info('Connected to rabbitmq', this.channel);

      consumers.forEach((consumer) => {
        consumer();
      });
    } catch (e) {
      logger.error(`RabbitMQ error ${e}`);
      setTimeout(() => this.connectChannel(consumers), 5000);
    }
  }

  publishToQueue(queueName, message, options) {
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), options);
  }

  /**
   * Send a message to a queue and wait for a response
   * @param {string} sendQueue - queue to send message to
   * @param {string} action - message action
   * @param {object} payload - message payload
   * @param {number} timeout - in milliseconds
   * @returns {Promise<object>} - response
   */
  async sendAndReceive(sendQueue, action, payload, timeout = 2000) {
    const correlationId = uuid();

    this.channel.assertQueue(sendQueue, { durable: true });

    // Create an exclusive reply queue
    const replyQueueResult = await this.channel.assertQueue('', { exclusive: true });
    const replyQueue = replyQueueResult.queue;

    return new Promise((resolve, reject) => {
      const handleMessage = async (message) => {
        if (message.properties.correlationId === correlationId) {
          const response = JSON.parse(message.content.toString());
          await this.channel.cancel(message.fields.consumerTag);
          await this.channel.deleteQueue(replyQueue);
          resolve(response);
        }
      };

      try {
        this.channel.consume(replyQueue, handleMessage, { noAck: true });

        this.publishToQueue(sendQueue, { action, payload }, { correlationId, replyTo: replyQueue });

        setTimeout(() => {
          reject(
            Error(
              'sendAndReceive timeout, please check:' +
                ' 1. Is the queue name correct?' +
                ' 2. Is the queue action correct?' +
                ' 3. Is the queue consumer ready?' +
                ' 4. Is the pairfly-shared library version correct?'
            )
          );
        }, timeout);
      } catch (e) {
        logger.error(`Error in sendAndReceive ${e}`);
        reject(e);
      }
    });
  }

  /**
   * Consume a queue and respond to the message
   * @param {string} queue - queue to consume
   * @param {function} messageHandler - function to handle the message
   */
  consumeAndRespond(queue, messageHandler) {
    const handleMessage = async (message) => {
      try {
        const content = message && message.content ? JSON.parse(message.content.toString()) : {};
        const response = await messageHandler(content);

        if (response) {
          this.publishToQueue(message.properties.replyTo, response, {
            correlationId: message.properties.correlationId,
          });
        }
        this.channel.ack(message);
      } catch (error) {
        logger.error(`Error in handleMessage: ${error}`);
        this.channel.ack(message);
      }
    };

    this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, handleMessage);
  }

  /**
   * Produce a message to a queue and wait for a response
   * @param producer - function that returns object with queue, action, and payload
   * @param args - arguments to pass to producer
   * @returns {Promise<Object>} - response
   */
  produce(producer, args) {
    const { queue, action, payload } = producer(...args);
    return this.sendAndReceive(queue, action, payload);
  }

  closeChannel() {
    this.channel.close();
    logger.info(`Closing rabbitmq channel`);
  }
}

module.exports = QueuesManager;
