const mongoose = require('mongoose');

const EmailLogSchema = new mongoose.Schema({
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toEmail: { type: String, required: true },
  variables: { type: Object, default: {} },
  sentAt: { type: Date, default: Date.now },
  success: { type: Boolean, default: true },
  response: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('EmailLog', EmailLogSchema);
