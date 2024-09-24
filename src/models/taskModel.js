import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        scrumboardId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Scrumboard is required"],
            ref: "Scrumboard",
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
        status: {
            type: String,
            trim: true,
        },
        subtasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subtask",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Task = mongoose.model("Task", taskSchema);
