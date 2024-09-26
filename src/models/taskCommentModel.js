import mongoose, { Schema } from "mongoose";

const taskCommentSchema = new Schema(
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
        message: {
            type: String,
            required: [true, "File path is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const TaskComment = mongoose.model("TaskComment", taskCommentSchema);
