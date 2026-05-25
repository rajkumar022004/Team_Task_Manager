import Project from '../models/Project.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';

const populateOptions = [
  { path: 'members', select: 'name email role' },
  { path: 'createdBy', select: 'name email role' },
];

const validateMemberIds = async (memberIds) => {
  if (!memberIds?.length) return [];

  const uniqueIds = [...new Set(memberIds.map(String))];
  const users = await User.find({ _id: { $in: uniqueIds } });

  if (users.length !== uniqueIds.length) {
    throw new ApiError(400, 'One or more member IDs are invalid', [
      { field: 'members', message: 'One or more member IDs do not exist' },
    ]);
  }

  return uniqueIds;
};

const canAccessProject = (project, user) => {
  if (user.role === 'admin') return true;
  return project.members.some((member) => member._id.toString() === user._id.toString());
};

export const getProjects = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === 'admin' ? {} : { members: req.user._id };

  const projects = await Project.find(filter)
    .populate(populateOptions)
    .sort({ createdAt: -1 });

  sendSuccess(res, { count: projects.length, data: projects });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(populateOptions);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (!canAccessProject(project, req.user)) {
    throw new ApiError(403, 'Not authorized to view this project');
  }

  sendSuccess(res, { data: project });
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, members } = req.body;

  const memberIds = await validateMemberIds(members);

  const project = await Project.create({
    title,
    description,
    members: memberIds,
    createdBy: req.user._id,
  });

  const populatedProject = await Project.findById(project._id).populate(populateOptions);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Project created successfully',
    data: populatedProject,
  });
});

export const addProjectMembers = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const newMemberIds = await validateMemberIds(req.body.members);

  const existingIds = new Set(project.members.map((id) => id.toString()));
  const idsToAdd = newMemberIds.filter((id) => !existingIds.has(id));

  project.members.push(...idsToAdd);
  await project.save();

  const populatedProject = await Project.findById(project._id).populate(populateOptions);

  sendSuccess(res, {
    message: 'Members added successfully',
    data: populatedProject,
  });
});
