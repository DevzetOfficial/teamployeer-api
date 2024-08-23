import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny  is required"],
            ref: "Company",
            index: true
        },
        employeeId: {
            type: String,
            required: [true, "Employee ID is required"],
            trim: true
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowecase: true,
            trim: true
        },
        mobile: {
            type: String,
            required: [true, "Mobile is required"],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        avatar: {
            type: String,
            trim: true
        },
        employeeType: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Employee type is required"],
            ref: "EmployeeType"
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Team is required"],
            ref: "Team"
        },
        designation: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Designation is required"],
            ref: "Designation"
        },
        employeeLevel: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Employee level is required"],
            ref: "EmployeeLevel"
        },
        supervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"
        },
        provationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Provation period is required"],
            trim: true
        },
        onboardingDate: {
            type: Date,
            required: [true, "Onboarding date is required"],
        },
        grossSalary: {
            type: Number
        },
        bonusPercentage: {
            type: Number
        },
        bankName: {
            type: String,
            required: [true, "Bank name is required"],
            trim: true
        },
        branchName: {
            type: String,
            required: [true, "Branch name is required"],
            trim: true
        },
        branchAddress: {
            type: String,
            required: [true, "Branch address is required"],
            trim: true
        },
        accountName: {
            type: String,
            required: [true, "Account nmae is required"],
            trim: true
        },
        accountNumber: {
            type: String,
            required: [true, "Account number is required"],
            trim: true
        },
        routingNumber: {
            type: String,
            required: [true, "Routing number is required"],
            trim: true
        },
        bicOrswiftNumber: {
            type: String,
            required: [true, "Bic or Swift number is required"],
            trim: true
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

employeeSchema.pre(/^find/, function (next) {
    this.populate("employeeType");
    next()
})

employeeSchema.pre(/^find/, function (next) {
    this.populate("employeeLevel");
    next()
})

employeeSchema.pre(/^find/, function (next) {
    this.populate("designation");
    next()
})

employeeSchema.pre(/^find/, function (next) {
    this.populate("team");
    next()
})

export const Employee = mongoose.model("Employee", employeeSchema)