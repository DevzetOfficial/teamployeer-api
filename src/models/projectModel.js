import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true,
        },
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Client id is required"],
            ref: "Client",
        },
        projectManager: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Project manage is required"],
            ref: "Employee",
        },
        submissionDate: {
            type: Date,
            required: [true, "Submission date is required"],
            trim: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "Member is required"],
                ref: "Employee",
            },
        ],
        projectImage: {
            type: String,
            trim: true,
            default: null,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            default: "Ongoing",
            trim: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Project = mongoose.model("Project", projectSchema);
