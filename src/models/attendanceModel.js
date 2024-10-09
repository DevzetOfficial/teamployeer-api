import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true,
        },
        employeeId: {
            type: String,
            required: true,
            trim: true,
        },
        checkIn: {
            type: String,
            required: [true, "Check in is required"],
            trim: true,
        },
        checkOut: {
            type: String,
            trim: true,
            default: null,
        },
        workedHours: {
            type: String,
            trim: true,
            default: null,
        },
        overtime: {
            type: String,
            trim: true,
            default: null,
        },
        status: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
