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
            required: [true, "Prioity is required"],
            enum: {
                values: ["Low", "Medium", "High", "Urgent"],
                message: "{VALUE} is not a valid status",
            },
            default: "Low",
            index: true,
        },
        members: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Employee",
                },
            ],
            default: [],
        },
        subtasks: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subtask",
                },
            ],
            default: [],
        },
        attachments: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "TaskAttachment",
                },
            ],
            default: [],
        },
        comments: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "TaskComment",
                },
            ],
            default: [],
        },
        startDate: {
            type: Date,
            default: null,
        },
        endDate: {
            type: Date,
            default: null,
        },
        position: {
            type: Number,
            require: [true, "Position is required"],
        },
    },
    {
        timestamps: true,
    }
);

export const Task = mongoose.model("Task", taskSchema);
