import mongoose, { Schema } from "mongoose";

const provationPeriodSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    month: {
        type: Number,
        default: 0,
    },
    position: {
        type: Number,
        required: true,
    },
});

export const ProvationPeriod = mongoose.model(
    "ProvationPeriod",
    provationPeriodSchema
);
