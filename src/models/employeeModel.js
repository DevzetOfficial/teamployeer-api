import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Company",
            index: true
        },
        empId: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowecase: true,
            trim: true
        },
        mobile: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        avatar: {
            type: String,
            trim: true
        },
        employeeType: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "EmployeeType"
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "Team"
        },
        designation: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "Designation"
        },
        employeeLevel: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "EmployeeLevel"
        },
        supervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"
        },
        provationPeriod: {
            type: String,
            trim: true
        },
        onboardingDate: {
            type: Date
        },
        grossSalary: {
            type: Number
        },
        bonusPercentage: {
            type: Number
        },
        bankName: {
            type: String,
            trim: true
        },
        branchName: {
            type: String,
            trim: true
        },
        branchAddress: {
            type: String,
            trim: true
        },
        accountName: {
            type: String,
            trim: true
        },
        accountNumber: {
            type: String,
            trim: true
        },
        routingNumber: {
            type: String,
            trim: true
        },
        bicOrswiftNumber: {
            type: String,
            trim: true
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

export const Client = mongoose.model("Client", employeeSchema)