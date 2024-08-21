import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Company",
            index: true
        },
        clientId: {
            type: String,
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
            lowecase: true,
            trim: true
        },
        mobile: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Country"
        },
        source: {
            type: String,
            require: true,
            trim: true
        },
        sourceLink: {
            type: String,
            trim: true
        },
        avatar: {
            type: String,
            trim: true
        },
        note: {
            type: String,
            trim: true
        },
        status: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
)

clientSchema.pre(/^find/, function (next) {
    this.populate({
        path: "country",
        select: "_id code name image"
    });
    next()
});

export const Client = mongoose.model("Client", clientSchema)