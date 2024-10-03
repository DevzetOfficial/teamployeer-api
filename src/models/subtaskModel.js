import mongoose, { Schema } from "mongoose";

const subtaskSchema = new Schema(
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
        title: {
            type: String,
            required: [true, "Subtask name is required"],
            trim: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee",
            },
        ],
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
        startDate: {
            type: Date,
            default: null,
        },
        endDate: {
            type: Date,
            default: null,
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

subtaskSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "fullName avatar",
    }).populate({
        path: "members",
        select: "name avatar",
    });
    next();
});

export const Subtask = mongoose.model("Subtask", subtaskSchema);
