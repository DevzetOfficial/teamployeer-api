import mongoose, { Schema } from "mongoose";

const designationSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
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