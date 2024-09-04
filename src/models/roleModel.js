import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true
        },
        name: {
            type: String,
            required: [true, "Role name is required"],
            trim: true,
        },
        permissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "Permission field is required"],
                ref: "Permission"
            }
        ]
    },
    {
        timestamps: true
    }
)

roleSchema.pre(/^find/, async function (next) {
    this.populate("permissions")
})

export const Role = mongoose.model("Role", roleSchema)