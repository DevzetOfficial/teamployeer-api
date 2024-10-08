import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { destroyOnCloudinary } from "../utils/cloudinary.js";

import { Project } from "../models/projectModel.js";
import { Scrumboard } from "../models/scrumboardModel.js";
import { Task } from "../models/taskModel.js";
import { Subtask } from "../models/subtaskModel.js";
import { TaskAttachment } from "../models/taskAttachmentModel.js";
import { TaskComment } from "../models/taskCommentModel.js";
import { TaskActivities } from "../models/taskActivitiesModel.js";

export const createData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;
    const projectId = req.params.projectId;
    const scrumboardId = req.params?.scrumboardId;

    const project = await Project.findOne({
        _id: projectId,
        companyId: companyId,
    }).select("title status");

    if (!project) {
        throw new ApiError(400, "Project not found");
    }

    const scrumboard = await Scrumboard.findOne({
        _id: scrumboardId,
        project: projectId,
    }).select("title color");

    if (!scrumboard) {
        throw new ApiError(400, "Scrumboard not found");
    }

    if (!req.body.title) {
        throw new ApiError(400, "Title is required");
    }

    const taskPosition = await Task.findOne({ scrumboard: scrumboardId })
        .sort({ position: -1 })
        .select("position");

    const taskData = {
        scrumboard: scrumboardId,
        user: req.user?._id,
        title: req.body.title,
        description: req.body?.description || "",
        position: taskPosition ? taskPosition.position + 1 : 1,
    };

    const newTask = await Task.create(taskData);

    if (!newTask) {
        throw new ApiError(400, "Invalid credentials");
    }

    // task push in scrumboard
    await addTaskToScrumboard(scrumboardId, newTask._id);

    // store activities
    await TaskActivities.create({
        projectId,
        taskId: newTask._id,
        activityType: "create-task",
        description: "created a new task <span>" + newTask.title + "</span>",
        user: req.user?._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(200, newTask, "Task created successfully"));
});

export const getData = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
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
            },
        })
        .sort({ position: 1 })
        .lean();

    if (!task) {
        throw new ApiError(400, "Task not found");
    }

    const activities = await TaskActivities.find({ projectId, taskId });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { task, activities },
                "Task retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const taskId = req.params?.id;
    const scrumboardId = req.params?.scrumboardId;

    const taskInfo = await Task.findOne({
        _id: taskId,
        scrumboard: scrumboardId,
    });

    if (!taskInfo) {
        throw new ApiError(400, "Task not found");
    }

    const updateTask = await Task.findByIdAndUpdate(taskId, req.body, {
        new: true,
    });

    if (!updateTask) {
        throw new ApiError(400, "Invalid credentials");
    }

    // store activities
    await TaskActivities.create({
        projectId,
        taskId,
        activityType: "update-task",
        description: "update the task <span>" + updateTask.title + "</span>",
        user: req.user?._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(200, updateTask, "Task update successfully"));
});

export const deleteData = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const taskId = req.params?.id;
    const scrumboardId = req.params?.scrumboardId;

    const taskInfo = await Task.findOne({
        _id: taskId,
        scrumboard: scrumboardId,
    }).populate({ path: "attachments", select: "name path" });

    if (!taskInfo) {
        throw new ApiError(400, "Task not found");
    }

    // delete attachment
    if (taskInfo.attachments.length > 0) {
        for (const row of taskInfo.attachments) {
            await destroyOnCloudinary(row.path);
        }

        await TaskAttachment.deleteMany({ taskId: taskId });
    }

    await Subtask.deleteMany({ taskId });
    await TaskComment.deleteMany({ taskId });
    await TaskActivities.deleteMany({ taskId });
    await removeTaskFromScrumboard(scrumboardId, taskId);

    await Task.findByIdAndDelete(taskId);

    // store activities
    await TaskActivities.create({
        projectId,
        taskId,
        activityType: "delete-task",
        description: "delete the task <span>" + taskInfo.title + "</span>",
        user: req.user?._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Task delete successfully"));
});

export const moveTask = asyncHandler(async (req, res) => {
    const projectId = req.params?.projectId;
    const taskId = req.params?.id;
    const scrumboardId = req.params?.scrumboardId;
    const toScrumboardId = req.params?.toScrumboardId;

    if (!toScrumboardId) {
        throw new ApiError(400, "To scrumboard is required");
    }

    const taskInfo = await Task.findOne({
        _id: taskId,
        scrumboard: scrumboardId,
    }).populate({ path: "scrumboard", select: "name" });

    if (!taskInfo) {
        throw new ApiError(400, "Task not found");
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

    const toScrumboard = Scrumboard.findById(toScrumboardId);

    // store activities
    await TaskActivities.create({
        projectId,
        taskId,
        activityType: "move-task",
        description:
            "moved task <span>" +
            taskInfo.scrumboard?.name +
            "</span> To <span>" +
            toScrumboard.name +
            "</span>",
        user: req.user?._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(200, updateTask, "Task move successfully"));
});

export const sortTask = asyncHandler(async (req, res) => {
    const scrumboardId = req.params?.scrumboardId;

    const tasks = await Task.find({ scrumboard: scrumboardId });
    if (tasks.length === 0) {
        throw new ApiError(400, "Task not found");
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
        .status(201)
        .json(new ApiResponse(200, {}, "Task position updated successfully"));
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
