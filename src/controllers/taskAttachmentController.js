import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Task } from "../models/taskModel.js";
import { TaskAttachment } from "../models/taskAttachmentModel.js";

export const createData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;

    const task = await Task.findById(taskId).select("title");

    if (!task) {
        throw new ApiError(400, "Task not found");
    }

    if (!req.body.fileName) {
        throw new ApiError(400, "File name is required");
    }

    if (!req.body.filePath) {
        throw new ApiError(400, "File path is required");
    }

    const attachmentPosition = await TaskAttachment.findOne({ taskId })
        .sort({ position: -1 })
        .select("position");

    const attachmentData = {
        taskId: taskId,
        user: req.user?._id,
        fileName: req.body.fileName,
        filePath: req.body.filePath,
        position: attachmentPosition ? attachmentPosition.position + 1 : 1,
    };

    const newAttachment = await TaskAttachment.create(attachmentData);

    if (!newAttachment) {
        throw new ApiError(400, "Invalid credentials");
    }

    // attachment push in task
    await addAttachmentToTask(taskId, newAttachment._id);

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                newAttachment,
                "Task attachment created successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;
    const attachmentId = req.params?.id;

    const attachment = await TaskAttachment.findOne({
        taskId,
        _id: attachmentId,
    });

    if (!attachment) {
        throw new ApiError(400, "Task attachment not found");
    }

    const updateAttachment = await TaskAttachment.findByIdAndUpdate(
        attachmentId,
        req.body,
        { new: true }
    );

    if (!updateAttachment) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                updateAttachment,
                "Task attachment update successfully"
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;
    const attachmentId = req.params?.id;

    const attachment = await TaskAttachment.findOne({
        taskId,
        _id: attachmentId,
    });

    if (!attachment) {
        throw new ApiError(400, "Task attachment not found");
    }

    await removeAttachmentFromTask(taskId, attachmentId);

    await TaskAttachment.findByIdAndDelete(attachmentId);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Task attachment delete successfully"));
});

export const sortAttachment = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;

    const tasks = await TaskAttachment.find({ taskId });
    if (tasks.length === 0) {
        throw new ApiError(400, "Task not found");
    }

    const updatedAttachment = req.body;

    if (updatedAttachment.length > 0) {
        for (const row of updatedAttachment) {
            await TaskAttachment.findByIdAndUpdate(row.id, {
                position: row.position,
            });
        }
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {},
                "Task attachment position updated successfully"
            )
        );
});

export const addAttachmentToTask = async (taskId, attachmentId) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $push: { attachments: attachmentId } },
            { new: true }
        );

        if (!updatedTask) {
            console.log("Task not found.");
            return;
        }

        console.log("Successfully adding attachments to task");
    } catch (error) {
        console.error("Error adding attachments to task:", error);
    }
};

export const removeAttachmentFromTask = async (taskId, attachmentId) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $pull: { attachments: attachmentId } },
            { new: true }
        );

        if (!updatedTask) {
            console.log("Task not found.");
            return;
        }

        console.log("Successfully remove attachments from task");
    } catch (error) {
        console.error("Error remove attachments from task:", error);
    }
};
