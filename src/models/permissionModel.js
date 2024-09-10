import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
});

export const Permission = mongoose.model("Permission", permissionSchema);
