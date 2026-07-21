import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled Document'
    },
    content: {
      type: String,
      default: ''
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    source: {
      type: String,
      enum: ['manual', 'upload'],
      default: 'manual'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);
