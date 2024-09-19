import mongoose, { Schema } from "mongoose";

const timeoffSchema = new Schema(
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
        timeoffType: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Time off type is required"],
            ref: "TimeoffType",
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
        },
        totalDay: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            trim: true,
        },
        attachments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TimeoffAttachment",
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

timeoffSchema.pre(/^find/, function (next) {
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

timeoffSchema.pre(/^find/, function (next) {
    this.populate({
        path: "timeoffType",
        select: "name",
    });
    next();
});

export const Timeoff = mongoose.model("Timeoff", timeoffSchema);
