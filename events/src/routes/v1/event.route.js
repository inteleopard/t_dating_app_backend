const express = require('express');
const {
  middlewares: { validate },
} = require('@appetism/binant-codetest-shared');

const eventController = require('../../controllers/event.controller');
const eventValidation = require('../../validations/event.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(auth(), eventController.getEvents)
  .post(auth(), validate(eventValidation.createEvent), eventController.createEvent);

router
  .route('/:eventId')
  .get(auth(), eventController.getEvent)
  .patch(auth(), validate(eventValidation.updateEvent), eventController.updateEventById)
  .delete(auth(), eventController.deleteEvent);

module.exports = router;
