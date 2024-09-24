import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true,
        },
        name: {
            type: String,
            required: [true, "Team name is required"],
            trim: true,
        },
        employees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Task = mongoose.model("Task", taskSchema);
