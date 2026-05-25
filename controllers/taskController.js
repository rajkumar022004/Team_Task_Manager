import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';

const populateOptions = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'project', select: 'title description' },
];

const findPopulatedTask = (id) => Task.findById(id).populate(populateOptions);

const validateProjectAndAssignee = async (projectId, assignedToId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found', [
      { field: 'project', message: 'Project not found' },
    ]);
  }

  const assignee = await User.findById(assignedToId);
  if (!assignee) {
    throw new ApiError(404, 'Assigned user not found', [
      { field: 'assignedTo', message: 'Assigned user not found' },
    ]);
  }

  if (assignee.role !== 'member') {
    throw new ApiError(400, 'Tasks can only be assigned to members', [
      { field: 'assignedTo', message: 'Tasks can only be assigned to members' },
    ]);
  }

  const isProjectMember = project.members.some(
    (memberId) => memberId.toString() === assignedToId.toString()
  );

  if (!isProjectMember) {
    throw new ApiError(400, 'Assigned user must be a member of the project', [
      {
        field: 'assignedTo',
        message: 'Assigned user must be a member of the project',
      },
    ]);
  }

  return project;
};

export const getTasks = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };

  const tasks = await Task.find(filter)
    .populate(populateOptions)
    .sort({ createdAt: -1 });

  sendSuccess(res, { count: tasks.length, data: tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, project, status, deadline } = req.body;

  await validateProjectAndAssignee(project, assignedTo);

  const task = await Task.create({
    title,
    description,
    assignedTo,
    project,
    status: status || 'Todo',
    deadline: deadline || null,
  });

  const populatedTask = await findPopulatedTask(task._id);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Task created successfully',
    data: populatedTask,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (req.user.role === 'admin') {
    const { title, description, assignedTo, project, status, deadline } = req.body;

    if (project && assignedTo) {
      await validateProjectAndAssignee(project, assignedTo);
    } else if (project) {
      await validateProjectAndAssignee(project, task.assignedTo);
    } else if (assignedTo) {
      await validateProjectAndAssignee(task.project, assignedTo);
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (project !== undefined) task.project = project;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined) task.deadline = deadline;
  } else {
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to update this task');
    }

    task.status = req.body.status;
  }

  await task.save();

  const populatedTask = await findPopulatedTask(task._id);

  sendSuccess(res, {
    message: 'Task updated successfully',
    data: populatedTask,
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  sendSuccess(res, { message: 'Task deleted successfully' });
});
