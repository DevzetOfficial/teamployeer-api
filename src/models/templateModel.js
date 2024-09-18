import mongoose, { Schema } from "mongoose";

const templateSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        template: {
            type: String,
            required: [true, "Template is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Template = mongoose.model("Template", templateSchema);
