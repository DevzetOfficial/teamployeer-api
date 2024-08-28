import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
    {
        companyId: {
            type: String,
            required: [true, "Comapny  is required"],
            index: true
        },
        name: {
            type: String,
            required: [true, "Team name is required"],
            trim: true,
        },
        teamHead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            index: true
        },
        employees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee"
            }
        ]
    },
    {
        timestamps: true
    }
)

/* teamSchema.pre(/^find/, function (next) {
    this.populate({
        path: "teamHead",
        select: "_id name email"
    })
    next()
}) */

export const Team = mongoose.model("Team", teamSchema)