import mongoose, { Schema } from "mongoose";

const projectStatusSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    position: {
        type: Number,
        required: true,
    },
});

export const ProjectStatus = mongoose.model(
    "ProjectStatus",
    projectStatusSchema
);
