const DELIVERY_SLOTS = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
};

const DELIVERY_SLOT_TIMES = {
  [DELIVERY_SLOTS.MORNING]: '8:00 AM - 11:00 AM',
  [DELIVERY_SLOTS.AFTERNOON]: '12:00 PM - 3:00 PM',
  [DELIVERY_SLOTS.EVENING]: '4:00 PM - 7:00 PM',
};

const USER_ROLES = {
  CUSTOMER: 'customer',
  TSU: 'tsu',
  SR: 'sr',
  OPS_MANAGER: 'ops_manager',
};

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const STOCK_UPDATE_TYPES = {
  MORNING: 'morning',
  EVENING: 'evening',
  MANUAL: 'manual',
};

const CUTOFF_TIME = '18:00'; // 6:00 PM
const STOCK_UPDATE_TIMES = ['08:00', '18:00']; // 8:00 AM and 6:00 PM

module.exports = {
  DELIVERY_SLOTS,
  DELIVERY_SLOT_TIMES,
  USER_ROLES,
  ORDER_STATUS,
  STOCK_UPDATE_TYPES,
  CUTOFF_TIME,
  STOCK_UPDATE_TIMES,
};
