import mongoose, { Schema } from "mongoose";

const employeeLevelSchema = new Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Comapny is required"],
        ref: "Company",
        index: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
});

export const EmployeeLevel = mongoose.model(
    "EmployeeLevel",
    employeeLevelSchema
);
