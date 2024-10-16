import mongoose, { Schema } from "mongoose";

const invoiceSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny id is required"],
            ref: "Company",
            index: true,
        },
        invoiceNo: {
            type: String,
            required: [true, "Invoice on is required"],
            trim: true,
            index: true,
        },
        invoiceType: {
            type: String,
            required: [true, "Invoice type is required"],
            enum: {
                values: ["Single", "Recurring"],
                message: "{VALUE} is not a valid invoice type",
            },
            index: true,
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Client is requried"],
            ref: "Client",
            index: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null,
            index: true,
        },
        subject: {
            type: String,
            trim: true,
            default: null,
        },
        issueDate: {
            type: Date,
            default: Date.now,
            index: true,
        },
        dueDate: {
            type: Date,
            default: Date.now,
        },
        reminder: {
            type: String,
            default: null,
        },
        recurringDate: {
            type: Date,
            default: null,
        },
        repeatUntil: {
            type: Date,
            default: null,
        },
        subtotal: {
            type: Number,
            default: 0,
        },
        discountPercentage: {
            type: Number,
            default: 0,
        },
        discountAmount: {
            type: Number,
            default: 0,
        },
        taxPercentage: {
            type: Number,
            default: 0,
        },
        texAmount: {
            type: Number,
            default: 0,
        },
        totalBill: {
            type: Number,
            default: 0,
        },
        isDraft: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            required: true,
            default: "Unpaid",
            enum: {
                values: ["Unpaid", "Paid", "On Hold"],
                message: "{VALUE} is not a valid invoice type",
            },
            index: true,
        },
        signature: {
            type: String,
            default: null,
        },
        template: {
            type: Object,
            default: null,
        },
        position: {
            type: Number,
            require: [true, "Position is required"],
        },
    },
    {
        timestamps: true,
    }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
