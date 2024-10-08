import mongoose, { Schema } from "mongoose";

const taskActivitiesSchema = new Schema(
    {
        activityType: {
            type: String,
            required: [true, "Activity type is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Task id is required"],
            ref: "Task",
            index: true,
        },
        subtask: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subtask",
            default: null,
        },
        attachment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TaskAttachment",
            default: null,
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TaskComment",
            default: null,
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
        path: "task",
        select: "title",
    });
    next();
});

taskActivitiesSchema.pre(/^find/, function (next) {
    this.populate({
        path: "subtask",
        select: "title",
    });
    next();
});

taskActivitiesSchema.pre(/^find/, function (next) {
    this.populate({
        path: "attachment",
        select: "fileName",
    });
    next();
});

taskActivitiesSchema.pre(/^find/, function (next) {
    this.populate({
        path: "comment",
        select: "message",
    });
    next();
});

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
