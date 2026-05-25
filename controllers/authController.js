import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import generateToken from '../utils/generateToken.js';
import { sendSuccess } from '../utils/apiResponse.js';

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email is already registered', [
      { field: 'email', message: 'Email is already registered' },
    ]);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'member',
  });

  const token = generateToken(user._id);

  sendSuccess(res, {
    statusCode: 201,
    message: 'User registered successfully',
    data: { token, user: formatUserResponse(user) },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  sendSuccess(res, {
    message: 'Login successful',
    data: { token, user: formatUserResponse(user) },
  });
});
