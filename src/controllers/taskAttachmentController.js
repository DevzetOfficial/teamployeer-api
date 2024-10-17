import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utils/cloudinary.js";

import { Task } from "../models/taskModel.js";
import { TaskAttachment } from "../models/taskAttachmentModel.js";
import { TaskActivities } from "../models/taskActivitiesModel.js";

export const createData = asyncHandler(async (req, res) => {
    const projectId = req.params?.projectId;
    const taskId = req.params?.taskId;

    const task = await Task.findById(taskId).select("title");

    if (!task) {
        throw new ApiError(400, "Task not found");
    }

    const attachments = [];
    if (req?.files && req.files.length > 0) {
        try {
            for (const file of req.files) {
                // Upload the file to Cloudinary
                const uploadData = await uploadOnCloudinary(file.path);

                const attachmentPosition = await TaskAttachment.findOne({
                    taskId,
                })
                    .sort({ position: -1 })
                    .select("position");

                // Prepare the attachment data to be saved in the database
                const attachmentData = {
                    taskId: taskId,
                    user: req.user?._id,
                    fileName: file.originalname,
                    filePath: uploadData?.url || "",
                    position: attachmentPosition
                        ? attachmentPosition.position + 1
                        : 1,
                };

                // Save the new attachment record to the database
                const newAttachment =
                    await TaskAttachment.create(attachmentData);

                attachments.push(newAttachment);

                await addAttachmentToTask(taskId, newAttachment._id);
            }
        } catch (error) {
            throw new ApiError(
                404,
                "Error uploading files or creating attachment:",
                error
            );
        }
    }

    // store activities
    const fileNames = attachments.map((file) => file.fileName).join(", ");
    await TaskActivities.create({
        projectId,
        taskId,
        activityType: "create-attachment",
        description: "added a attachment <span>" + fileNames + "</span>",
        user: req.user?._id,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                attachments,
                "Task attachment created successfully"
            )
        );
});

export const getData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;

    const task = await Task.findById(taskId).select("title");

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const attachmentList = await TaskAttachment.find({ taskId }).select(
        "-taskId -position -__v"
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                attachmentList,
                "Task attachments retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const projectId = req.params?.projectId;
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
        attachment._id,
        req.body,
        { new: true }
    );

    if (!updateAttachment) {
        throw new ApiError(400, "Invalid credentials");
    }

    // store activities
    await TaskActivities.create({
        projectId,
        taskId,
        activityType: "update-attachment",
        description:
            "updated a attachment <span>" +
            updateAttachment.fileName +
            "</span>",
        user: req.user?._id,
    });

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
    const projectId = req.params?.projectId;
    const taskId = req.params?.taskId;
    const attachmentId = req.params?.id;

    const attachment = await TaskAttachment.findOne({
        taskId,
        _id: attachmentId,
    });

    if (!attachment) {
        throw new ApiError(400, "Task attachment not found");
    }

    await destroyOnCloudinary(attachment.filePath);

    await removeAttachmentFromTask(taskId, attachmentId);

    await TaskAttachment.findByIdAndDelete(attachmentId);

    // store activities
    await TaskActivities.create({
        projectId,
        taskId,
        activityType: "delete-attachment",
        description:
            "deleted a attachment <span>" + attachment.fileName + "</span>",
        user: req.user?._id,
    });

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
