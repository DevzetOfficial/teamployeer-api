import mongoose, { Schema } from "mongoose";

const countrySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            trim: true
        },
        emoji: {
            type: String,
            trim: true
        },
        unicode: {
            type: String,
            trim: true
        },
        dialCode: {
            type: String,
            trim: true
        },
        avatar: {
            type: String,
            trim: true
        }
    }
)


export const Country = mongoose.model("Country", countrySchema)