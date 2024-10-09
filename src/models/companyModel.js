import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
        },
        companyType: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "CompanyType",
        },
        companySize: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "CompanySize",
        },
        email: {
            type: String,
            required: true,
            lowecase: true,
            unique: true,
            trim: true,
            index: true,
        },
        mobile: {
            type: String,
            trim: true,
            default: null,
        },
        address: {
            type: String,
            trim: true,
            default: null,
        },
        startTime: {
            type: String,
            trim: true,
            default: null,
        },
        endTime: {
            type: String,
            trim: true,
            default: null,
        },
        logo: {
            type: String,
            trim: true,
            default: null,
        },
        systemSettings: {
            type: Schema.Types.Mixed,
            trim: true,
        },
        emailSettings: {
            type: Schema.Types.Mixed,
            trim: true,
        },
        companyPolicy: {
            type: String,
            trim: true,
            default: null,
        },
        medicalBenefits: {
            type: String,
            trim: true,
            default: null,
        },
        festibalBenefits: {
            type: String,
            trim: true,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Company = mongoose.model("Company", companySchema);
