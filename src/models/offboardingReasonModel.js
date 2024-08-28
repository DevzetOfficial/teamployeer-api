import mongoose, { Schema } from "mongoose";

const offboardingReasonSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        }
    }
)

export const OffboardingReason = mongoose.model("OffboardingReason", offboardingReasonSchema)