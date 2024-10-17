import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Task } from "../models/taskModel.js";
import { TaskActivities } from "../models/taskActivitiesModel.js";

export const getData = asyncHandler(async (req, res) => {
    const projectId = req.params?.projectId;
    const taskId = req.params?.taskId;

    const taskInfo = await Task.findById(taskId);

    if (!taskInfo) {
        throw new ApiError(404, "Task not found");
    }

    const filters = { projectId, taskId };

    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const activities = await TaskActivities.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalItems = await TaskActivities.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(201).json(
        new ApiResponse(
            200,
            {
                results: activities,
                currentPage: page,
                totalPage: totalPages,
                firstPage: 1,
                lastPage: totalPages,
                totalItems: totalItems,
            },
            "Task activities retrieved successfully"
        )
    );
});

export const deleteData = asyncHandler(async (req, res) => {
    const projectId = req.params?.projectId;
    const taskId = req.params?.taskId;
    const activityId = req.params?.id;

    const activity = await TaskActivities.findOne({
        projectId,
        taskId,
        _id: activityId,
    });

    if (!activity) {
        throw new ApiError(404, "Task activities not found");
    }

    await TaskActivities.findByIdAndDelete(activityId);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Task activities delete successfully"));
});
