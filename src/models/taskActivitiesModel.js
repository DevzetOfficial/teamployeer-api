import mongoose, { Schema } from "mongoose";

const taskActivitiesSchema = new Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Task id is required"],
            ref: "Task",
            index: true,
        },
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Task id is required"],
            ref: "Task",
            index: true,
        },
        activityType: {
            type: String,
            required: [true, "Activity type is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"],
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

taskActivitiesSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "fullName avatar",
    });
    next();
});

export const TaskActivities = mongoose.model(
    "TaskActivities",
    taskActivitiesSchema
);
