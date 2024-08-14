import mongoose, { Schema } from "mongoose";

const companyTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        }
    }
)


export const CompanyType = mongoose.model("CompanyType", companyTypeSchema)