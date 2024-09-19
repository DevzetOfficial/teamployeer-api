import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema({
    permissionType: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    position: {
        type: Number,
    },
});

export const Permission = mongoose.model("Permission", permissionSchema);
