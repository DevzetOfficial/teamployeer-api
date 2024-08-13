import mongoose, { Schema } from "mongoose";

const employeeLevelSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        }
    }
)

export const EmployeeLevel = mongoose.model("EmployeeLevel", employeeLevelSchema)