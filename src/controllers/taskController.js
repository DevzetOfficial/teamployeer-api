import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { objectId, getSegments, ucfirst } from "../utilities/helper.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utilities/cloudinary.js";

import { Project } from "../models/projectModel.js";
import { Scrumboard } from "../models/scrumboardModel.js";
import { Task } from "../models/taskModel.js";
import { Subtask } from "../models/subtaskModel.js";
import { TaskAttachment } from "../models/taskAttachmentModel.js";
import { TaskComment } from "../models/taskCommentModel.js";

export const createTask = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;
    const projectId = req.params.projectId;
    const scrumboardId = req.body?.scrumboardId;

    const project = await Project.findOne({
        _id: projectId,
        companyId: companyId,
    }).select("title status");

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const scrumboard = await Scrumboard.findOne({
        _id: scrumboardId,
        project: projectId,
    }).select("title color");

    if (!scrumboard) {
        throw new ApiError(404, "Scrumboard not found");
    }

    if (!req.body.title) {
        throw new ApiError(404, "Title is required");
    }

    const taskData = {
        scrumboard: scrumboardId,
        user: req.user?._id,
        title: req.body.title,
        description: req.body?.description || "",
        priority: req.body?.priority || "",
        assignMembers: req.body?.assignMembers || [],
        subtasks: req.body?.subtasks || [],
        dueDate: req.body?.dueDate || "",
    };

    const newTask = await Task.create(taskData);

    if (!newTask) {
        throw new ApiError(400, "Invalid credentials");
    }

    // task push in scrumboard
    await Scrumboard.findByIdAndUpdate(
        scrumboardId,
        { $push: { tasks: newTask._id } },
        { new: true }
    );

    return res
        .status(201)
        .json(new ApiResponse(201, newTask, "Task created successfully"));
});

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;
    const projectId = req.params.id;
    const filters = { companyId: companyId, _id: projectId };

    const project = await Project.findOne(filters)
        .populate({ path: "client", select: "title source avatar" })
        .populate({ path: "projectManager", select: "title avatar" })
        .populate({
            path: "assignMembers",
            select: "title avatar",
            populate: {
                path: "designation",
                model: "Designation",
                select: "title",
            },
        })
        .lean();

    if (!project) {
        throw new ApiError(400, "Project not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project retrieved successfully"));
});

export const updateTask = asyncHandler(async (req, res) => {
    const taskId = req.body?.taskId;
    const scrumboardId = req.body?.scrumboardId;

    const taskInfo = await Task.findOne({
        _id: taskId,
        scrumboard: scrumboardId,
    });

    if (!taskInfo) {
        throw new ApiError(404, "Task not found");
    }

    delete req.body.scrumboardId;
    delete req.body.taskId;

    const updateTask = await Task.findByIdAndUpdate(taskId, req.body, {
        new: true,
    });

    if (!updateTask) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, updateTask, "Task update successfully"));
});

export const deleteData = asyncHandler(async (req, res) => {
    const taskId = req.body?.taskId;
    const scrumboardId = req.body?.scrumboardId;

    const taskInfo = await Task.findOne({
        _id: taskId,
        scrumboard: scrumboardId,
    });

    if (!taskInfo) {
        throw new ApiError(404, "Task not found");
    }

    // Delete the subtask, attachment, comment associated with the task
    await Subtask.deleteMany({ taskId: taskId });
    await TaskAttachment.deleteMany({ taskId: taskId });
    await TaskComment.deleteMany({ taskId: taskId });

    // Delete task
    await Task.findByIdAndDelete(taskId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task delete successfully"));
});
