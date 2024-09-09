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
            ref: "LeaveType"
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
        attachments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TimeOffAttachment"
            }
        ],
        status: {
            type: String,
            required: true,
            default: "Pending",
            enum: ["Pending", "Approved", "Declined"]
        }
    },
    {
        timestamps: true
    }, 
    {
        toJSON: {
            transform: function (doc, ret) {
            ret.startDate = ret.startDate.toISOString().split('T')[0];
            ret.endDate = ret.endDate.toISOString().split('T')[0];
            return ret;
            }
        }
    }
)

timeOffSchema.set('toJSON', { getters: true });

timeOffSchema.pre(/^find/, function (next) {
    this.populate({
        path: "employee",
        select: "employeeId name avatar"
    })
    next()
})

timeOffSchema.pre(/^find/, function (next) {
    this.populate({
        path: "leaveType",
        select: "name"
    })
    next()
})

export const TimeOff = mongoose.model("TimeOff", timeOffSchema)