import mongoose, { Schema } from "mongoose";

const leaveTypeSchema = new Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Comapny is required"],
        ref: "Company",
        index: true,
    },
    name: {
        type: String,
        required: [true],
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});

export const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);
