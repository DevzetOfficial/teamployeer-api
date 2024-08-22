import mongoose, { Schema } from "mongoose";

const designationSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        }
    },
    {
        timestamps: true
    }
)

export const Designation = mongoose.model("Designation", designationSchema)