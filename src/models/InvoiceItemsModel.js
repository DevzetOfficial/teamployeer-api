import mongoose, { Schema } from "mongoose";

const invoiceItemsSchema = new Schema(
    {
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Invoice id is required"],
            ref: "Invoice",
            index: true,
        },
        name: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        subtotal: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const InvoiceItems = mongoose.model("InvoiceItems", invoiceItemsSchema);
