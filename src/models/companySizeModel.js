import mongoose, { Schema } from "mongoose";

const companySizeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        }
    }
)

export const CompanySize = mongoose.model("CompanySize", companySizeSchema)