import mongoose, { Schema } from "mongoose";

const companySizeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    position: {
        type: Number,
        required: true,
    },
});

export const CompanySize = mongoose.model("CompanySize", companySizeSchema);
