import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getMembers = asyncHandler(async (req, res) => {
  const members = await User.find({ role: 'member' })
    .select('name email role')
    .sort({ name: 1 });

  sendSuccess(res, { count: members.length, data: members });
});
