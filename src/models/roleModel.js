import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        permissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Permission"
            }
        ]
    },
    {
        timestamps: true
    }
)

roleSchema.pre(/^filter/, async function (next) {
    this.populate("permissions")
})

export const Role = mongoose.model("Role", roleSchema)