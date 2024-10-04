import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { destroyOnCloudinary } from "../utilities/cloudinary.js";

import { Project } from "../models/projectModel.js";
import { Scrumboard } from "../models/scrumboardModel.js";
import { Task } from "../models/taskModel.js";
import { Subtask } from "../models/subtaskModel.js";
import { TaskAttachment } from "../models/taskAttachmentModel.js";
import { TaskComment } from "../models/taskCommentModel.js";

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
        .populate({ path: "scrumboard", select: "name color" })
        .populate({ path: "user", select: "fullName avatar" })
        .populate({ path: "members", select: "name avatar" })
        .populate("subtasks")
        .populate("attachments")
        .populate({
            path: "comments",
            select: "taskId message createdAt",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "replies",
                select: "taskId message createdAt",
                populate: {
                    path: "user",
                    select: "fullName avatar",
                },
                options: { sort: { createdAt: -1 } },
            },
        })
        .sort({ position: 1 })
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

    await Subtask.deleteMany({ taskId: taskId });
    await TaskComment.deleteMany({ taskId: taskId });
    await Task.findByIdAndDelete(taskId);

    await removeTaskFromScrumboard(scrumboardId, taskId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task delete successfully"));
});

export const moveTask = asyncHandler(async (req, res) => {
    const taskId = req.params?.id;
    const scrumboardId = req.params?.scrumboardId;
    const toScrumboardId = req.params?.toScrumboardId;

    if (!toScrumboardId) {
        throw new ApiError(400, "To scrumboard is required");
    }

    const taskInfo = await Task.findOne({
        _id: taskId,
        scrumboard: scrumboardId,
    });

    if (!taskInfo) {
        throw new ApiError(404, "Task not found");
    }

    // remove task from scrumboard
    await removeTaskFromScrumboard(scrumboardId, taskId);

    // add task to scrumboard
    await addTaskToScrumboard(toScrumboardId, taskId);

    // get task max position
    const taskPosition = await Task.findOne({ scrumboard: toScrumboardId })
        .sort({ position: -1 })
        .select("position");

    // update task
    const updateTask = await Task.findByIdAndUpdate(
        taskId,
        {
            scrumboard: toScrumboardId,
            position: taskPosition ? taskPosition.position + 1 : 1,
        },
        { new: true }
    );

    return res
        .status(201)
        .json(new ApiResponse(201, updateTask, "Task move successfully"));
});

export const sortTask = asyncHandler(async (req, res) => {
    const scrumboardId = req.params?.scrumboardId;

    const tasks = await Task.find({ scrumboard: scrumboardId });
    if (tasks.length === 0) {
        throw new ApiError(404, "Task not found");
    }

    const updatedTask = req.body;

    if (updatedTask.length > 0) {
        for (const row of updatedTask) {
            await Task.findByIdAndUpdate(
                { _id: row.id },
                { position: row.position }
            );
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(201, {}, "Task position updated successfully"));
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
