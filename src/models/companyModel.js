import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },
        companyType: {
            type: String,
            required: true,
            trim: true
        },
        companySize: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
            index: true
        },
        mobile: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        startTime: {
            type: String,
            trim: true,
        },
        endTime: {
            type: String,
            trim: true,
        },
        logo: {
            type: String
        },
    },
    {
        timestamps: true
    }
)

export const Company = mongoose.model("Company", companySchema)