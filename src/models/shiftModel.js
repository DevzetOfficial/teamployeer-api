import mongoose, { Schema } from "mongoose";

const shiftSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true,
        },
        name: {
            type: String,
            required: [true, "Shift name is required"],
            trim: true,
        },
        coordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        },
        startTime: {
            type: String,
            required: [true, "Start time is required"],
            trim: true,
        },
        endTime: {
            type: String,
            required: [true, "End time is required"],
            trim: true,
        },
        workedHours: {
            type: String,
            trim: true,
            default: null,
        },
        workDays: {
            type: [String],
            required: true,
            enum: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: (props) => "At least one work day must be selected.",
            },
        },
        status: {
            type: Number,
            default: 1,
            enum: [0, 1],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Shift = mongoose.model("Shift", shiftSchema);
