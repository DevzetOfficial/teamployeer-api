import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

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
import { populate } from "dotenv";

export const createData = asyncHandler(async (req, res) => {
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

    const taskPosition = await Task.findOne({ scrumboard: scrumboardId })
        .sort({ position: -1 })
        .select("position");

    const taskData = {
        scrumboard: scrumboardId,
        user: req.user?._id,
        title: req.body.title,
        description: req.body?.description || "",
        members: [],
        subtasks: [],
        attachments: [],
        comments: [],
        dueDate: "",
        position: taskPosition ? taskPosition.position + 1 : 1,
    };

    const newTask = await Task.create(taskData);

    if (!newTask) {
        throw new ApiError(400, "Invalid credentials");
    }

    // task push in scrumboard
    await addTaskToScrumboard(scrumboardId, newTask._id);

    return res
        .status(201)
        .json(new ApiResponse(201, newTask, "Task created successfully"));
});

export const getData = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const scrumboardId = req.params?.scrumboardId;

    const filters = { scrumboard: scrumboardId, _id: taskId };

    const task = await Task.findOne(filters)
        .populate({ path: "scrumboard", select: "project name color" })
        .populate({ path: "user", select: "fullName avatar" })
        .populate({ path: "members", select: "name avatar" })
        .populate("subtasks")
        .populate("attachments")
        .populate({
            path: "comments",
            populate: {
                path: "replies",
                populate: { path: "user", select: "fullName avatar" },
            },
        })
        .lean();

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Project retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const taskId = req.params?.id;
    const scrumboardId = req.params?.scrumboardId;

    const taskInfo = await Task.findOne({
        _id: taskId,
        scrumboard: scrumboardId,
    });

    if (!taskInfo) {
        throw new ApiError(404, "Task not found");
    }

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
    const taskId = req.params?.id;
    const scrumboardId = req.params?.scrumboardId;

    const taskInfo = await Task.findOne({
        _id: taskId,
        scrumboard: scrumboardId,
    }).populate({ path: "attachments", select: "name path" });

    if (!taskInfo) {
        throw new ApiError(404, "Task not found");
    }

    // delete attachment
    if (taskInfo.attachments.length > 0) {
        for (const row of taskInfo.attachments) {
            await destroyOnCloudinary(row.path);
        }

        await TaskAttachment.deleteMany({ taskId: taskId });
    }
    // Delete the subtask, attachment, comment associated with the task
    await Subtask.deleteMany({ taskId: taskId });
    await TaskComment.deleteMany({ taskId: taskId });

    // Delete task
    await Task.findByIdAndDelete(taskId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task delete successfully"));
});

export const addTaskToScrumboard = async (scrumboardId, taskId) => {
    try {
        const updatedScrumboard = await Scrumboard.findByIdAndUpdate(
            scrumboardId,
            { $push: { tasks: taskId } },
            { new: true }
        );

        if (!updatedScrumboard) {
            console.log("Scrumboard not found.");
            return;
        }

        console.log("Successfully adding task to scrumboard");
    } catch (error) {
        console.error("Error adding task to scrumboard:", error);
    }
};

export const removeTaskFromScrumboard = async (scrumboardId, taskId) => {
    try {
        const updatedScrumboard = await Scrumboard.findByIdAndUpdate(
            scrumboardId,
            { $pull: { tasks: taskId } },
            { new: true }
        );

        if (!updatedScrumboard) {
            console.log("Scrumboard not found.");
            return;
        }

        console.log("Successfully remove task from scrumboard");
    } catch (error) {
        console.error("Error remove task from scrumboard:", error);
    }
};
