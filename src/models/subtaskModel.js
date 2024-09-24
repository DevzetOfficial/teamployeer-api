import mongoose, { Schema } from "mongoose";

const subtaskSchema = new Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Task is required"],
            ref: "Task",
            index: true,
        },
        name: {
            type: String,
            required: [true, "Team name is required"],
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
    },
    {
        timestamps: true,
    }
);

export const Subtask = mongoose.model("Subtask", subtaskSchema);
