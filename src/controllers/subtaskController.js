import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Task } from "../models/taskModel.js";
import { Subtask } from "../models/subtaskModel.js";

export const createData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;

    const task = await Task.findById(taskId).select("title");

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if (!req.body.title) {
        throw new ApiError(400, "Title is required");
    }

    const subtaskPosition = await Subtask.findOne({ taskId })
        .sort({ position: -1 })
        .select("position");

    const subtaskData = {
        taskId: taskId,
        user: req.user?._id,
        title: req.body.title,
        members: [],
        position: subtaskPosition ? subtaskPosition.position + 1 : 1,
    };

    const newSubtask = await Subtask.create(subtaskData);

    if (!newSubtask) {
        throw new ApiError(400, "Invalid credentials");
    }

    // subtask push in task
    await addSubtaskToTask(taskId, newSubtask._id);

    return res
        .status(201)
        .json(new ApiResponse(200, newSubtask, "Subtask created successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;
    const subtaskId = req.params?.id;

    const subtask = await Subtask.findOne({ taskId, _id: subtaskId });

    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    const updateSubtask = await Subtask.findByIdAndUpdate(subtaskId, req.body, {
        new: true,
    });

    if (!updateSubtask) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, updateSubtask, "Subtask update successfully")
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;
    const subtaskId = req.params?.id;

    const subtask = await Subtask.findOne({ taskId, _id: subtaskId });

    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    await removeSubtaskFromTask(taskId, subtaskId);

    await Subtask.findByIdAndDelete(subtaskId);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Subtask delete successfully"));
});

export const sortSubtask = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;

    const tasks = await Subtask.find({ taskId });
    if (tasks.length === 0) {
        throw new ApiError(400, "Task not found");
    }

    const updatedSubtask = req.body;

    if (updatedSubtask.length > 0) {
        for (const row of updatedSubtask) {
            await Subtask.findByIdAndUpdate(row.id, { position: row.position });
        }
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, {}, "Subtask position updated successfully")
        );
});

export const addSubtaskToTask = async (taskId, subtaskId) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $push: { subtasks: subtaskId } },
            { new: true }
        );

        if (!updatedTask) {
            console.log("Task not found.");
            return;
        }

        console.log("Successfully adding subtask to task");
    } catch (error) {
        console.error("Error adding subtask to task:", error);
    }
};

export const removeSubtaskFromTask = async (taskId, subtaskId) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $pull: { subtasks: subtaskId } },
            { new: true }
        );

        if (!updatedTask) {
            console.log("Task not found.");
            return;
        }

        console.log("Successfully remove subtask from task");
    } catch (error) {
        console.error("Error remove subtask from task:", error);
    }
};
