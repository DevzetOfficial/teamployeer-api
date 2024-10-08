import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { TaskActivities } from "../models/taskActivitiesModel.js";

export const getData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;

    const task = Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const activities = TaskActivities.find({ task: taskId });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                activities,
                "Task activities retrieved successfully"
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const taskId = req.params?.taskId;
    const activityId = req.params?.id;

    const activity = await TaskActivities.findOne({
        taskId,
        _id: activityId,
    });

    if (!activity) {
        throw new ApiError(404, "Task activity not found");
    }

    await TaskActivities.findByIdAndDelete(activityId);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Tak activity delete successfully"));
});
