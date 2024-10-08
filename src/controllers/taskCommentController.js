import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Task } from "../models/taskModel.js";
import { TaskComment } from "../models/taskCommentModel.js";
import { TaskActivities } from "../models/taskActivitiesModel.js";

export const createData = asyncHandler(async (req, res) => {
    const projectId = req.params?.projectId;
    const taskId = req.params?.taskId;

    const task = await Task.findById(taskId).select("title");

    if (!task) {
        throw new ApiError(400, "Task not found");
    }

    if (!req.body.message) {
        throw new ApiError(400, "Message is required");
    }

    const commentData = {
        taskId: taskId,
        user: req.user?._id,
        message: req.body.message,
    };

    const newComment = await TaskComment.create(commentData);

    if (!newComment) {
        throw new ApiError(400, "Invalid credentials");
    }

    // comment push in task
    await addCommentToTask(taskId, newComment._id);

    // store activities
    await TaskActivities.create({
        projectId,
        taskId,
        activityType: "create-comment",
        description: "commented <pre>" + newComment.message + "</pre>",
        user: req.user?._id,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                newComment,
                "Task comment created successfully"
            )
        );
});

export const getData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;

    const task = await Task.findById(taskId).select("title");

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const comments = await TaskComment.find({ taskId }).select(
        "-taskId -position -__v"
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                comments,
                "Task comments retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;
    const commentId = req.params?.id;

    const comment = await TaskComment.findOne({
        taskId,
        _id: commentId,
    });

    if (!comment) {
        throw new ApiError(400, "Task comment not found");
    }

    const updateComment = await TaskComment.findByIdAndUpdate(
        commentId,
        req.body,
        { new: true }
    );

    if (!updateComment) {
        throw new ApiError(400, "Invalid credentials");
    }

    // store activities
    await TaskActivities.create({
        projectId,
        taskId,
        activityType: "update-comment",
        description:
            "updated a comment <pre>" + updateComment.message + "</pre>",
        user: req.user?._id,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                updateComment,
                "Task comment update successfully"
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;
    const commentId = req.params?.id;

    const comment = await TaskComment.findOne({
        taskId,
        _id: commentId,
    });

    if (!comment) {
        throw new ApiError(400, "Task comment not found");
    }

    await removeCommentFromTask(taskId, commentId);

    await TaskComment.findByIdAndDelete(commentId);

    await TaskComment.deleteMany({ parentCommentId: { $in: comment.replies } });

    // store activities
    await TaskActivities.create({
        projectId,
        taskId,
        activityType: "delete-comment",
        description: "deleted a comment <pre>" + comment.message + "</pre>",
        user: req.user?._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Task comment delete successfully"));
});

export const addCommentToTask = async (taskId, commentId) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $push: { comments: commentId } },
            { new: true }
        );

        if (!updatedTask) {
            console.log("Task not found.");
            return;
        }

        console.log("Successfully adding comment to task");
    } catch (error) {
        console.error("Error adding comment to task:", error);
    }
};

export const removeCommentFromTask = async (taskId, commentId) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $pull: { comments: commentId } },
            { new: true }
        );

        if (!updatedTask) {
            console.log("Task not found.");
            return;
        }

        console.log("Successfully remove comment from task");
    } catch (error) {
        console.error("Error remove comment from task:", error);
    }
};

export const createReply = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;
    const commentId = req.params?.commentId;

    const comment = await TaskComment.findOne({
        taskId,
        _id: commentId,
    });

    if (!comment) {
        throw new ApiError(400, "Comment not found");
    }

    if (!req.body.message) {
        throw new ApiError(400, "Message is required");
    }

    const replayData = {
        taskId: taskId,
        user: req.user?._id,
        message: req.body.message,
        parentCommentId: commentId,
    };

    const newReply = await TaskComment.create(replayData);

    if (!newReply) {
        throw new ApiError(400, "Invalid credentials");
    }

    // comment push in task
    await addReplayToComment(commentId, newReply._id);

    return res
        .status(201)
        .json(
            new ApiResponse(200, newReply, "Comment reply created successfully")
        );
});

export const updateReply = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;
    const commentId = req.params?.commentId;
    const replyId = req.params?.id;

    const reply = await TaskComment.findOne({
        taskId,
        _id: replyId,
        parentCommentId: commentId,
    });

    if (!reply) {
        throw new ApiError(400, "Reply not found");
    }

    const updateReply = await TaskComment.findByIdAndUpdate(replyId, req.body, {
        new: true,
    });

    if (!updateReply) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, updateReply, "Reply update successfully"));
});

export const deleteReply = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;
    const commentId = req.params?.commentId;
    const replyId = req.params?.id;

    const reply = await TaskComment.findOne({
        taskId,
        _id: replyId,
        parentCommentId: commentId,
    });

    if (!reply) {
        throw new ApiError(400, "Reply not found");
    }

    await removeReplayFromComment(commentId, replyId);

    await TaskComment.findByIdAndDelete(replyId);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Task comment delete successfully"));
});

export const addReplayToComment = async (commentId, replyId) => {
    try {
        const updatedComment = await TaskComment.findByIdAndUpdate(
            commentId,
            { $push: { replies: replyId } },
            { new: true }
        );

        if (!updatedComment) {
            console.log("Comment not found.");
            return;
        }

        console.log("Successfully adding reply to comment");
    } catch (error) {
        console.error("Error adding reply to comment:", error);
    }
};

export const removeReplayFromComment = async (commentId, replyId) => {
    try {
        const updatedComment = await TaskComment.findByIdAndUpdate(
            commentId,
            { $pull: { replies: replyId } },
            { new: true }
        );

        if (!updatedComment) {
            console.log("Comment not found.");
            return;
        }

        console.log("Successfully remove reply from comment");
    } catch (error) {
        console.error("Error remove reply from comment:", error);
    }
};
