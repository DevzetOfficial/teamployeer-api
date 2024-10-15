import mongoose, { Schema } from "mongoose";

const invoiceSchema = new Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Comapny is required"],
            ref: "Company",
            index: true,
        },
        invoiceType: {
            type: String,
            required: [true, "Invoice type is required"],
            enum: {
                values: ["Single", "Recurring"],
                message: "{VALUE} is not a valid invoice type",
            },
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Client is requried"],
            trim: true,
            index: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true,
            index: true,
            default: null,
        },
        issueDate: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
            default: Date.now,
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
            default: 0,
        },
        status: {
            type: Number,
            required: true,
            default: "Unpaid",
            enum: {
                values: ["Unpaid", "Paid", "On Hold"],
                message: "{VALUE} is not a valid invoice type",
            },
        },
        invoiceItems: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "InvoiceItems",
                },
            ],
            default: [],
        },
        signature: {
            type: String,
            default: null,
        },
        template: {
            type: Object,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
