import mongoose, { Schema } from "mongoose";

const subtaskSchema = new Schema(
    {
        task: {
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
        title: {
            type: String,
            required: [true, "Subtask name is required"],
            trim: true,
        },
        assignMembers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee",
            },
        ],
        priority: {
            type: String,
            trim: true,
        },
        dueDate: {
            type: Date,
        },
        isComplete: {
            type: Boolean,
            default: false,
        },
        position: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

export const Subtask = mongoose.model("Subtask", subtaskSchema);
