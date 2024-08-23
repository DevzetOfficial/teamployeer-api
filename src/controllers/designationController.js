import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"

import { Designation } from "../models/designationModel.js"

export const createData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66c57d08fff68ef283165008"

    const data = req.body;

    data.companyId = companyId

    const newData = await Designation.create(data);

    if (!newData) {
        throw new ApiError(400, "Invalid credentials.")
    }

    return res.status(201).json(new ApiResponse(201, newData, "Designation created successfully"));
})

export const getAllData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66c57d08fff68ef283165008"

    const filters = { companyId: companyId }

    const allData = await Designation.find(filters)

    return res.status(201).json(new ApiResponse(200, allData, "Designation retrieved successfully"))
})

export const getData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66c57d08fff68ef283165008"

    const filters = { _id: req.params.id, companyId: companyId }

    const info = await Designation.findOne(filters).select("-__v");

    if (!info) {
        throw new ApiError(400, "Designation not found")
    }

    return res.status(200).json(new ApiResponse(200, info, "Designation retrieved successfully"));

})

export const updateData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66c57d08fff68ef283165008"
    const filters = { _id: req.params.id, companyId: companyId }

    const info = await Designation.findOneAndUpdate(
        filters,
        req.body,
        { new: true }
    );

    if (!info) {
        throw new ApiError(404, "Designation not found");
    }

    return res.status(200).json(new ApiResponse(200, info, "Designation updated successfully."));
})

export const deleteData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66c57d08fff68ef283165008"
    const filters = { _id: req.params.id, companyId: companyId }

    const info = await Designation.findOneAndDelete(filters)

    if (!info) {
        throw new ApiError(404, "Designation not found!")
    }

    await Designation.findOneAndDelete(req.params.id);

    return res.status(200).json(new ApiResponse(200, {}, "Designation delete successfully."));
})

