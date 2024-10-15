import mongoose, { Schema } from "mongoose";

const employeeDocumentSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true,
        },
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Employee ID is required"],
            ref: "Employee",
            index: true,
        },
        documentType: {
            type: String,
            required: [true, "Document type is required"],
            enum: ["joining", "others"],
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: (props) => "Select joining or others",
            },
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        fileName: {
            type: String,
            trim: true,
        },
        attachment: {
            type: String,
            required: [true, "Attachment is required"],
            trim: true,
        },
        submitted: {
            type: Date,
            required: [true, "Submitted date is required"],
        },
        approved: {
            type: Date,
        },
        status: {
            type: String,
            required: [true, "Status is required"],
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

export const EmployeeDocument = mongoose.model(
    "EmployeeDocument",
    employeeDocumentSchema
);
