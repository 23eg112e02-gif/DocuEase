import mongoose from 'mongoose';

const collaboratorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['editor', 'viewer'],
      default: 'editor'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const versionSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Untitled Document' },
    content: { type: String, default: '' },
    savedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    label: { type: String, default: '' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

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
    collaborators: {
      type: [collaboratorSchema],
      default: []
    },
    versions: {
      type: [versionSchema],
      default: []
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
    },
    collaborationState: {
      type: Buffer,
      select: false
    }
  },
  { timestamps: true }
);

documentSchema.index({ 'collaborators.user': 1 });

export const MAX_VERSIONS = 30;

export default mongoose.model('Document', documentSchema);
