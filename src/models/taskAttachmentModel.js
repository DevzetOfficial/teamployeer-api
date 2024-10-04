import mongoose, { Schema } from "mongoose";

const taskAttachmentSchema = new Schema(
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
        fileName: {
            type: String,
            required: [true, "File name is required"],
            trim: true,
        },
        filePath: {
            type: String,
            required: [true, "File path is required"],
            trim: true,
        },
        position: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

taskAttachmentSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "fullName avatar",
    });
    next();
});

export const TaskAttachment = mongoose.model(
    "TaskAttachment",
    taskAttachmentSchema
);
