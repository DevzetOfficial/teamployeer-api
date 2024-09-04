import mongoose, { Schema } from "mongoose";

const offboardingTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        position: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const OffboardingType = mongoose.model("OffboardingType", offboardingTypeSchema)