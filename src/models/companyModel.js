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
            type: String,
            trim: true,
        },
        emailSettings: {
            type: Schema.Types.Mixed,
            trim: true,
        },
        companyPolicy: {
            type: String,
            trim: true,
        },
        medicalBenefits: {
            type: String,
            trim: true,
        },
        festibalBenefits: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

companySchema.pre(/^find/, function (next) {
    this.populate({
        path: "companyType",
        select: "name",
    });
    next();
});

companySchema.pre(/^find/, async function (next) {
    this.populate({
        path: "companySize",
        select: "name",
    });
    next();
});

export const Company = mongoose.model("Company", companySchema);
