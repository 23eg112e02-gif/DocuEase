import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: String,
  resourceId: mongoose.Schema.Types.ObjectId,
  ip: String,
  userAgent: String,
  oldValues: mongoose.Schema.Types.Mixed,
  newValues: mongoose.Schema.Types.Mixed,
  metadata: mongoose.Schema.Types.Mixed,
  success: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

export default mongoose.model('AuditLog', auditLogSchema);