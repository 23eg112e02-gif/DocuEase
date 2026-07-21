import Document from '../models/Document.js';
import Upload from '../models/Upload.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const [documents, uploads, documentCount, uploadCount] = await Promise.all([
    Document.find({ owner: req.user._id }).sort({ updatedAt: -1 }).limit(10),
    Upload.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(10),
    Document.countDocuments({ owner: req.user._id }),
    Upload.countDocuments({ owner: req.user._id })
  ]);

  res.json(
    new ApiResponse(200, {
      documents,
      uploads,
      stats: {
        documentCount,
        uploadCount
      }
    }, 'Dashboard loaded')
  );
});
