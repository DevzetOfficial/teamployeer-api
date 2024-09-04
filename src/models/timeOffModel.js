import mongoose, { Schema } from "mongoose";

const timeOffSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true
        },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Employee ID is required"],
            ref: "Employee"
        },
        leaveType: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Leave type is required"],
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
            get: (date) => {
                return date ? date.toISOString().split('T')[0] : date;
            }
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
            get: (date) => {
                return date ? date.toISOString().split('T')[0] : date;
            }
        },
        reason: {
            type: String,
            trim: true
        },
        attachment: {
            type: String,
            trim: true
        },
        status: {
            type: Number,
            required: true,
            default: "Pending",
            enum: ["Pending", "Approved", "Declined"]
        }
    },
    {
        timestamps: true
    }
)

timeOffSchema.pre(/^find/, function (next) {
    this.populate({
        path: "employee",
        select: "name avatar"
    })
    next()
})

export const TimeOff = mongoose.model("TimeOff", timeOffSchema)