import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny field is required"],
            index: true
        },
        name: {
            type: String,
            required: [true, "Team name is required"],
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
    },
    {
        timestamps: true
    }
)

teamSchema.pre(/^filter/, async function (next) {
    this.populate("teamHead")
})

teamSchema.pre(/^filter/, async function (next) {
    this.populate("employees")
})

export const Team = mongoose.model("Team", teamSchema)