import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema(
    {
        companyId: {
            type: String,
            required: [true, "Comapny  is required"],
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
        shift: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Shift period is required"],
            ref: "Shift"
        },
        provationPeriod: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Provation period is required"],
            ref: "ProvationPeriod"
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
        accountHolderName: {
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
        offboardingDate: {
            type: Date
        },
        offboardingType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OffboardingType"
        },
        reason: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OffboardingReason"
        },
        note: {
            type: String,
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
    this.populate({
        path: "employeeType",
        select: "_id name"
    })
    next()
})

employeeSchema.pre(/^find/, function (next) {
    this.populate({
        path: "team",
        select: "_id name"
    })
    next()
})

employeeSchema.pre(/^find/, function (next) {
    this.populate({
        path: "designation",
        select: "_id name"
    })
    next()
})

employeeSchema.pre(/^find/, function (next) {
    this.populate({
        path: "employeeLevel",
        select: "_id name"
    })
    next()
})


employeeSchema.pre(/^find/, function (next) {
    this.populate({
        path: "shift",
        select: "_id name"
    })
    next()
})

employeeSchema.pre(/^find/, function (next) {
    this.populate({
        path: "offboardingType",
        select: "_id name"
    })
    next()
})

employeeSchema.pre(/^find/, function (next) {
    this.populate({
        path: "reason",
        select: "_id name"
    })
    next()
})


export const Employee = mongoose.model("Employee", employeeSchema)