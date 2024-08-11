import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        companyName: {
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

export const Client = mongoose.model("Client", clientSchema)