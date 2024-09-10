import mongoose, { Schema } from "mongoose";

const employeeTypeSchema = new Schema({
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

export const EmployeeType = mongoose.model("EmployeeType", employeeTypeSchema);
