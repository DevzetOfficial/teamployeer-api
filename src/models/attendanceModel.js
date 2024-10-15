import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true,
        },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Employee is required"],
            ref: "Employee",
            index: true,
        },
        checkIn: {
            type: String,
            trim: true,
            default: null,
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
        latein: {
            type: String,
            trim: true,
            default: null,
        },
        status: {
            type: String,
            required: [true, "Status is required"],
            enum: {
                values: ["Present", "Absent", "Late"],
                message: "{VALUE} is not a valid status",
            },
        },
    },
    {
        timestamps: true,
    }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
