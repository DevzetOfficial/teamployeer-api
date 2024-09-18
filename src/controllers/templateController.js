import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { Template } from "../models/templateModel.js";

export const createData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const data = req.body;

    data.companyId = companyId;

    const newTemplate = await Template.create(data);

    if (!newTemplate) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, newTemplate, "Template created successfully")
        );
});

export const getAllData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId };

    const allData = await Template.find(filters).sort({ createdAt: 1 });

    return res
        .status(201)
        .json(new ApiResponse(200, allData, "Template retrieved successfully"));
});

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const template = await Template.findOne(filters);

    if (!template) {
        throw new ApiError(400, "Template not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, template, "Template retrieved successfully")
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const designation = await Template.findOne(filters);

    if (!designation) {
        throw new ApiError(400, "Template not found");
    }

    const updateTemplate = await Template.findByIdAndUpdate(
        designation._id,
        req.body,
        { new: true }
    );

    if (!updateTemplate) {
        throw new ApiError(404, "Template not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updateTemplate,
                "Template updated successfully."
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const designation = await Template.findOne(filters);

    if (!designation) {
        throw new ApiError(400, "Template not found");
    }

    await Template.findOneAndDelete(req.params.id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Template delete successfully"));
});
