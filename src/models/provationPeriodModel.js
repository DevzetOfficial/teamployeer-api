import mongoose, { Schema } from "mongoose";

const provationPeriodSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        }
    }
)

export const ProvationPeriod = mongoose.model("ProvationPeriod", provationPeriodSchema)