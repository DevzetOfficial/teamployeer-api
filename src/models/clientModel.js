import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny  is required"],
            index: true
        },
        clientId: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, "Client name is required"],
            trim: true
        },
        companyName: {
            type: String,
            required: [true, "Company name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowecase: true,
            trim: true
        },
        mobile: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true
        },
        address: {
            type: String,
            trim: true,
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Country is required"],
            ref: "Country"
        },
        source: {
            type: String,
            required: [true, "Source is required"],
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
            required: true,
            default: 1,
            enum: [0, 1]
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