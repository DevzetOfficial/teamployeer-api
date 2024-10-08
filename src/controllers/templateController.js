import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Template } from "../models/templateModel.js";

export const createData = asyncHandler(async (req, res) => {
    const data = req.body;

    data.companyId = req.user?.companyId;

    const newTemplate = await Template.create(data);

    if (!newTemplate) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, newTemplate, "Template created successfully")
        );
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const allData = await Template.find(filters)
        .select("name template")
        .sort({ createdAt: 1 })
        .lean();

    return res
        .status(201)
        .json(new ApiResponse(200, allData, "Template retrieved successfully"));
});

export const getData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const template = await Template.findOne(filters).lean();

    if (!template) {
        throw new ApiError(400, "Template not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, template, "Template retrieved successfully")
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const designation = await Template.findOne(filters).lean();

    if (!designation) {
        throw new ApiError(400, "Template not found");
    }

    const updateTemplate = await Template.findByIdAndUpdate(
        designation._id,
        req.body,
        { new: true }
    );

    if (!updateTemplate) {
        throw new ApiError(400, "Template not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                updateTemplate,
                "Template updated successfully."
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const designation = await Template.findOne(filters).lean();

    if (!designation) {
        throw new ApiError(400, "Template not found");
    }

    await Template.findOneAndDelete(req.params.id);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Template delete successfully"));
});
