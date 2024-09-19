import mongoose, { Schema } from "mongoose";

const timeoffAttachmentSchema = new Schema({
    timeoffId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Time off id is required"],
        ref: "TimeOff",
        index: true,
    },
    name: {
        type: String,
        required: [true, "File name is required"],
        trim: true,
    },
    attachment: {
        type: String,
        trim: true,
    },
});

export const TimeoffAttachment = mongoose.model(
    "TimeoffAttachment",
    timeoffAttachmentSchema
);
