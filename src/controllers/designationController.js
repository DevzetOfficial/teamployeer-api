import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Designation } from "../models/designationModel.js";

export const createData = asyncHandler(async (req, res) => {
    const data = req.body;

    data.companyId = req.user?.companyId;

    const newData = await Designation.create(data);

    if (!newData) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, newData, "Designation created successfully")
        );
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const allData = await Designation.find(filters).lean();

    return res
        .status(201)
        .json(
            new ApiResponse(200, allData, "Designation retrieved successfully")
        );
});

export const getData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const designation = await Designation.findOne(filters);

    if (!designation) {
        throw new ApiError(404, "Designation not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                designation,
                "Designation retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const designation = await Designation.findOne(filters);

    if (!designation) {
        throw new ApiError(404, "Designation not found");
    }

    const updateDesignation = await Designation.findByIdAndUpdate(
        designation._id,
        req.body,
        { new: true }
    );

    if (!updateDesignation) {
        throw new ApiError(400, "Designation not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                updateDesignation,
                "Designation updated successfully."
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const designation = await Designation.findOne(filters);

    if (!designation) {
        throw new ApiError(404, "Designation not found");
    }

    await Designation.findOneAndDelete(req.params.id);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Designation delete successfully"));
});
