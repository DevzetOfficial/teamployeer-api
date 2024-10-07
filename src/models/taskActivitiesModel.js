import mongoose, { Schema } from "mongoose";

const taskActivitiesSchema = new Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Task is required"],
            ref: "Task",
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "User id is required"],
            ref: "User",
            index: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
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
