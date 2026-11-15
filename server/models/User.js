import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,
    refreshTokens: [{
      tokenHash: { type: String, required: true },
      expiresAt: { type: Date, required: true },
      userAgent: String,
      ip: String
    }],
    passwordResetTokenHash: String,
    passwordResetExpires: Date,
    deletedAt: Date
  },
  { timestamps: true }
);

userSchema.virtual('isLocked').get(function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil > new Date());
});

userSchema.methods.incLoginAttempts = async function incLoginAttempts() {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
  }
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.resetLoginAttempts = async function resetLoginAttempts() {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  return token;
};

userSchema.methods.clearPasswordReset = function clearPasswordReset() {
  this.passwordResetTokenHash = undefined;
  this.passwordResetExpires = undefined;
};

export default mongoose.model('User', userSchema);
