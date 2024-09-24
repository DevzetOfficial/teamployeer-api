import { tr } from "date-fns/locale";
import mongoose, { Schema } from "mongoose";

const usertokenSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        lowecase: true,
        trim: true,
        index: true,
    },
    token: {
        type: String,
        required: [true, "Token is required"],
        trim: true,
        index: true,
    },
    createdAt: {
        type: Date,
        trim: true,
        default: Date.now(),
    },
    expireAt: {
        type: Date,
        trim: true,
        default: () => new Date(Date.now() + 5 * 60 * 1000), // Current time + 5 minutes
    },
});

export const Usertoken = mongoose.model("Usertoken", usertokenSchema);
