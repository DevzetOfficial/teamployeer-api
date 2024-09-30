import mongoose, { Schema } from "mongoose";

const scrumboardSchema = new Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Project is required"],
            ref: "Project",
            index: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        color: {
            type: String,
            required: [true, "Color is required"],
            trim: true,
        },
        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
            },
        ],
        position: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

export const Scrumboard = mongoose.model("Scrumboard", scrumboardSchema);
