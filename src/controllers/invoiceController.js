import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { strPad, getSegments, ucfirst } from "../utils/helper.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utils/cloudinary.js";

import { Invoice } from "../models/invoiceModel.js";
import { InvoiceItems } from "../models/InvoiceItemsModel.js";

export const createData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const invoicePosition = await Invoice.findOne({ companyId })
        .sort({ position: -1 })
        .select("position")
        .lean();

    const invoiceNo = invoicePosition ? invoicePosition.position + 1 : 1;

    if (!req.body?.client) {
        throw new ApiError(400, "Client is required");
    }

    const formData = req.body;

    const invoiceData = {
        companyId,
        invoiceNo: strPad(invoiceNo),
        invoiceType: formData.invoiceType,
        client: formData.client,
        issueDate: formData.issueDate,
        subject: formData.subject,
        subtotal: formData.subtotal,
        discountPercentage: formData.discountPercentage,
        discountAmount: formData.discountAmount,
        taxPercentage: formData.taxPercentage,
        taxAmount: formData.taxAmount,
        totalBill: formData.totalBill,
        position: invoicePosition ? invoicePosition.position + 1 : 1,
    };

    if (formData.project) {
        invoiceData.project = formData.project;
    }

    if (formData.isDraft) {
        invoiceData.isDraft = formData.isDraft;
    }

    if (formData.invoiceType === "Single") {
        invoiceData.dueDate = formData.dueDate;
    }

    if (formData.invoiceType === "Recurring") {
        invoiceData.dueDate = formData.issueDate;
        invoiceData.reminder = formData.reminder;
        invoiceData.recurringDate = formData.recurringDate;
        invoiceData.repeatUntil = formData.repeatUntil;
    }

    if (req.file?.path) {
        const signature = await uploadOnCloudinary(req.file?.path);
        invoiceData.signature = signature?.url || "";
    }

    if (formData.template) {
        invoiceData.template = formData.template;
    }

    const newInvoice = await Invoice.create(invoiceData);
    if (!newInvoice) {
        throw new ApiError(400, "Invalid credentials");
    }

    const invoiceItems = formData?.invoiceItems || "";

    if (invoiceItems) {
        for (const item of invoiceItems) {
            const invoiceItem = new InvoiceItems({
                invoiceId: newInvoice._id,
                name: item.name,
                description: item.description,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
            });

            await invoiceItem.save();
        }
    }

    return res
        .status(201)
        .json(new ApiResponse(200, newInvoice, "Invoice created successfully"));
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const segments = getSegments(req.url);

    if (segments?.[1]) {
        if (segments[1] === "draft") {
            filters.isDraft = true;
        } else {
            filters.invoiceType = ucfirst(segments[1]);
            filters.isDraft = false;
        }
    }

    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const invoices = await Invoice.find(filters)
        .select("invoiceNo invoiceType totalBill issueDate")
        .populate({ path: "client", select: "name avatar" })
        .populate({ path: "project", select: "name" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalItems = await Invoice.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(201).json(
        new ApiResponse(
            200,
            {
                results: invoices,
                currentPage: page,
                totalPage: totalPages,
                firstPage: 1,
                lastPage: totalPages,
                totalItems: totalItems,
            },
            "Invoice retrieved successfully"
        )
    );
});

export const getCountData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const [invoices, totalDraft] = await Promise.all([
        Invoice.aggregate([
            {
                $match: {
                    companyId: { $eq: companyId },
                    isDraft: false,
                },
            },
            {
                $group: {
                    _id: "$invoiceType",
                    count: { $sum: 1 },
                },
            },
        ]),
        Invoice.countDocuments({ companyId, isDraft: true }),
    ]);

    const dataCount = {
        all: 0,
        single: 0,
        recurring: 0,
        draft: totalDraft,
    };

    if (invoices) {
        invoices.forEach((row) => {
            if (row._id === "Single") {
                dataCount.single = row.count;
            }

            if (row._id === "Recurring") {
                dataCount.recurring = row.count;
            }
        });
    }

    dataCount.all = dataCount.single + dataCount.recurring + dataCount.draft;

    return res
        .status(201)
        .json(new ApiResponse(200, dataCount, "Invoice count successfully"));
});

export const getData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const invoice = await Invoice.findOne(filters)
        .select("-position -updatedAt -__v")
        .populate({
            path: "client",
            select: "name email mobile address avatar",
        })
        .populate({ path: "project", select: "name" })
        .lean();

    if (!invoice) {
        throw new ApiError(404, "Invoice not found");
    }

    const invoiceItems = await InvoiceItems.find({
        invoiceId: invoice._id,
    }).select("-__v -createdAt -updatedAt");

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { invoice, invoiceItems },
                "Invoice retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const employeeInfo = await Invoice.findOne(filters).lean();

    if (!employeeInfo) {
        throw new ApiError(404, "Invoice not found");
    }

    const data = req.body;

    if (req.file && req.file?.path) {
        const uploadAvatar = await uploadOnCloudinary(req.file?.path);
        data.avatar = uploadAvatar?.url || "";

        if (employeeInfo && employeeInfo.avatar) {
            await destroyOnCloudinary(employeeInfo.avatar);
        }
    }

    const employee = await Invoice.findOneAndUpdate(filters, data, {
        new: true,
    });

    return res
        .status(201)
        .json(new ApiResponse(200, employee, "Invoice updated successfully"));
});

export const deleteData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const invoiceInfo = await Invoice.findOne(filters);

    if (!invoiceInfo) {
        throw new ApiError(404, "Invoice not found");
    }

    // delete invoice
    await Invoice.findByIdAndDelete(invoiceInfo._id);

    // delete invoice item
    await InvoiceItems.deleteMany({ invoiceId: invoiceInfo._id });

    // delete signature
    if (invoiceInfo.signature) {
        await destroyOnCloudinary(invoiceInfo.signature);
    }

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Invoice delete successfully"));
});
