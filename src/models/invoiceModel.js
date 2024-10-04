import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true,
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            trim: true,
            index: true,
        },
        projectId: {
            type: String,
            required: [true, "Client name is required"],
            trim: true,
        },
        totalbill: {
            type: Number,
            default: 0,
        },
        isPaid: {
            type: Boolean,
            default: 0,
        },
        status: {
            type: Number,
            required: true,
            default: 1,
            enum: [0, 1],
        },
    },
    {
        timestamps: true,
    }
);

export const Client = mongoose.model("Client", clientSchema);
