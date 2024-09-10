import mongoose, { Schema } from "mongoose";

const leaveTypeSchema = new Schema({
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

export const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);
