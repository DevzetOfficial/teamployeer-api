import mongoose, { Schema } from "mongoose";

const timeOffSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true,
        },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Employee ID is required"],
            ref: "Employee",
        },
        leaveType: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Leave type is required"],
            ref: "LeaveType",
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
        },
        reason: {
            type: String,
            trim: true,
        },
        attachments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TimeOffAttachment",
            },
        ],
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Approved", "Declined"],
            required: true,
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: (props) => "Select Approved either Decliend.",
            },
        },
    },
    {
        timestamps: true,
    }
);

timeOffSchema.pre(/^find/, function (next) {
    this.populate({
        path: "employee",
        select: "employeeId name avatar",
        populate: [
            { path: "designation", model: "Designation", select: "name" },
            { path: "team", model: "Team", select: "name" },
        ],
    });
    next();
});

timeOffSchema.pre(/^find/, function (next) {
    this.populate({
        path: "leaveType",
        select: "name",
    });
    next();
});

export const TimeOff = mongoose.model("TimeOff", timeOffSchema);
