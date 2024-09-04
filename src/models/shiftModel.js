import mongoose, { Schema } from "mongoose";

const shiftSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true
        },
        name: {
            type: String,
            required: [true, "Shift name is required"],
            trim: true,
        },
        coordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"
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
        workDays: {
            type: [String],
            required: true,
            enum: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: props => "At least one work day must be selected."
            }
        },
        status: {
            type: Number,
            required: true,
            default: 1,
            enum: [0, 1]
        }
    },
    {
        timestamps: true
    }
)

shiftSchema.pre(/^find/, function (next) {
    this.populate({
        path: "coordinator",
        select: "_id name email"
    })
    next()
})

export const Shift = mongoose.model("Shift", shiftSchema)