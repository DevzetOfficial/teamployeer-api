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
            required: [true, "Client name is required"],
            trim: true,
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Client  is required"],
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
        assignMembers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "Assign member is required"],
                ref: "Employee",
            },
        ],
        projectImage: {
            type: String,
            trim: true,
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
        scrumboards: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Scrumboard",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Project = mongoose.model("Project", projectSchema);
