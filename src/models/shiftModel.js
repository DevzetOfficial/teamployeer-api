import mongoose, { Schema } from "mongoose";

const shiftSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny field is required"],
            index: true
        },
        name: {
            type: String,
            required: [true, "Shift name is required"],
            trim: true,
        },
        cordinator: {
            type: String,
            trim: true,
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
            enum: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: props => 'At least one work day must be selected.'
            }
        },
    },
    {
        timestamps: true
    }
)

export const Shift = mongoose.model("Shift", shiftSchema)