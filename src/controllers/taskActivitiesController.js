import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { objectId } from "../utils/helper.js";

import { Task } from "../models/taskModel.js";
import { TaskActivities } from "../models/taskActivitiesModel.js";

export const getData = asyncHandler(async (req, res) => {
    const projectId = req.params?.projectId;
    const taskId = req.params?.taskId;

    const taskInfo = await Task.findById(taskId);

    if (!taskInfo) {
        throw new ApiError(404, "Task not found");
    }

    const activities = await TaskActivities.find({ projectId, taskId });

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
    const projectId = req.params?.projectId;
    const taskId = req.params?.taskId;
    const activityId = req.params?.id;

    const activity = await TaskActivities.findOne({
        projectId,
        taskId,
        _id: activityId,
    });

    console.log(activity);

    if (!activity) {
        throw new ApiError(404, "Task activities not found");
    }

    await TaskActivities.findByIdAndDelete(activityId);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Task activities delete successfully"));
});
