import mongoose from 'mongoose';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const matchStage =
    req.user.role === 'admin'
      ? {}
      : { assignedTo: new mongoose.Types.ObjectId(req.user._id) };

  const now = new Date();

  const [stats] = await Task.aggregate([
    { $match: matchStage },
    {
      $facet: {
        total: [{ $count: 'count' }],
        completed: [
          { $match: { status: 'Completed' } },
          { $count: 'count' },
        ],
        pending: [
          { $match: { status: { $ne: 'Completed' } } },
          { $count: 'count' },
        ],
        overdue: [
          {
            $match: {
              status: { $ne: 'Completed' },
              deadline: { $ne: null, $lt: now },
            },
          },
          { $count: 'count' },
        ],
      },
    },
    {
      $project: {
        totalTasks: { $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0] },
        completedTasks: { $ifNull: [{ $arrayElemAt: ['$completed.count', 0] }, 0] },
        pendingTasks: { $ifNull: [{ $arrayElemAt: ['$pending.count', 0] }, 0] },
        overdueTasks: { $ifNull: [{ $arrayElemAt: ['$overdue.count', 0] }, 0] },
      },
    },
  ]);

  sendSuccess(res, {
    data: stats ?? {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      overdueTasks: 0,
    },
  });
});
