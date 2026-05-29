const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../constants/notificationTypes');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
    },
    title: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 1000 },
    email: { type: String, default: null },
    emailSubject: { type: String, default: null },
    emailSent: { type: Boolean, default: false },
    emailSimulated: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
