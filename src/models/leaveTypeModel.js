import mongoose, { Schema } from "mongoose";

const leaveTypeSchema = new Schema(
    {
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
        amount: {
            type: Number,
            required: [true, "Amount is required"],
        },
    },
    {
        timestamps: true,
    }
);

export const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);
