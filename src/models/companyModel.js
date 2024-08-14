import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },
        companyType: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "CompanyType"
        },
        companySize: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "CompanySize"
        },
        email: {
            type: String,
            required: true,
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


companySchema.pre(/^filter/, async function (next) {
    this.populate({
        path: "companyType",
        select: "_id name"
    })
    next()
})

companySchema.pre(/^filter/, async function (next) {
    this.populate({
        path: "companySize",
        select: "_id name"
    })
    next()
})

export const Company = mongoose.model("Company", companySchema)