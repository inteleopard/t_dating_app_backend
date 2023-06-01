module.exports = {
  GENDERS: ['M', 'F'],
  ORDER_STATUS: {
    PENDING: 'pending',
    FAILED: 'failed',
    SUCCESS: 'success',
    REFUND_PENDING: 'refund_pending',
  },
  EVENT_UPCOMING: 'event_upcoming',
  EVENT_PAST: 'event_past',
  MAX_CLASS: 5,
  CURRENCIES: {
    USD: 'USD',
  },
  QUEUES: {
    USER: 'queue:user',
    ORDER: 'queue:order',
    EVENT: 'queue:event',
  },
  QUEUES_ACTIONS: {
    USER: {
      GET_BY_ID: 'action:user:get_by_id',
      UPDATE_BY_ID: 'action:user:update_by_id',
    },
    ORDER: {
      FIND_UPDATE_ORDER: 'action:order:find_update_order',
    },
    EVENT: {
      EXIT_ALL_EVENTS: 'action:event:exit_all_events',
    },
  },
};
