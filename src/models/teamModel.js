import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        teamHead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"
        },
        employees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employee"
            }
        ]

    }
)

teamSchema.pre(/^filter/, async function (next) {
    this.populate("teamHead")
})

teamSchema.pre(/^filter/, async function (next) {
    this.populate("employees")
})

export const Team = mongoose.model("Team", teamSchema)