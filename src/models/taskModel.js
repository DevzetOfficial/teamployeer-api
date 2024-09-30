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
        name: {
            type: String,
            required: [true, "Task name is required"],
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
        dueDate: {
            type: Date,
        },
        status: {
            type: String,
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

export const Task = mongoose.model("Task", taskSchema);
