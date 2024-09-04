import mongoose, { Schema } from "mongoose";

const leaveStatusSchema = new Schema(
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

export const LeaveStatus = mongoose.model("LeaveStatus", leaveStatusSchema)