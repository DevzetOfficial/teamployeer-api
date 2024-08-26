import mongoose, { Schema } from "mongoose";

const designationSchema = new Schema(
    {
        companyId: {
            type: String,
            required: [true, "Comapny  is required"],
            index: true
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        }
    },
    {
        timestamps: true
    }
)

export const Designation = mongoose.model("Designation", designationSchema)