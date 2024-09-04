import mongoose, { Schema } from "mongoose";

const employeeLevelSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        position: {
            type: Number,
            required: true
        }
    }
)

export const EmployeeLevel = mongoose.model("EmployeeLevel", employeeLevelSchema)