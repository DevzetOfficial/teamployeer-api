import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        scrumboard: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Scrumboard is required"],
            ref: "Scrumboard",
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
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        priority: {
            type: String,
            trim: true,
        },
        assignMembers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee",
            },
        ],
        subtasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subtask",
            },
        ],
        attachments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TaskAttachment",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TaskComment",
            },
        ],
        dueDate: {
            type: Date,
        },
        status: {
            type: String,
            required: [true, "Status is required"],
            enum: {
                values: ["Low", "Medium", "High", "Urgent"],
                message: "{VALUE} is not a valid status",
            },
            default: "Low",
            index: true,
        },
        position: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

export const Task = mongoose.model("Task", taskSchema);
