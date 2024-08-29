import mongoose, { Schema } from "mongoose";

const employeeDocumentSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Company is required"],
            ref: "Company",
            index: true
        },
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Employee ID is required"],
            ref: "Employee",
            index: true
        },
        documentType: {
            type: String,
            required: [true, "Document type is required"],
            enum: ['Joining Document', 'Others Document'],
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: props => 'Select Joining Document or Others Document'
            }
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        attachment: {
            type: String,
            required: [true, "Attachment is required"],
            trim: true
        },
        submitted: {
            type: Date,
            required: [true, "Submitted date is required"],
            get: (date) => date.toISOString().split('T')[0]
        },
        approved: {
            type: Date,
            get: (date) => date.toISOString().split('T')[0]
        },
        status: {
            type: String,
            required: [true, "Status is required"],
            default: "Pending",
            enum: ["Pending", "Approved"]
        }
    },
    {
        timestamps: true
    }
)


export const EmployeeDocument = mongoose.model("EmployeeDocument", employeeDocumentSchema)