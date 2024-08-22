import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"

import { Shift } from "../models/shiftModel.js"


export const createData = asyncHandler(async (req, res) => {

    const formData = req.body;

    let cordinator
    if (formData.cordinator) {
        cordinator = formData.cordinator
    }

    const storeData = {
        //companyId: req.user.companyId,
        companyId: "66bdec36e1877685a60200ac",
        name: formData.name,
        cordinator: cordinator,
        startTime: formData.startTime,
        endTime: formData.endTime,
        workDays: formData.workDays,
    }

    const newShift = await Shift.create(storeData);

    if (!newShift) {
        throw new ApiError(400, "Invalid credentials.")
    }

    return res.status(201).json(new ApiResponse(200, newShift, "Shift created successfully."));
})

export const getAllData = asyncHandler(async (req, res) => {

    const filters = { companyId: "66bdec36e1877685a60200ac" }

    const results = await Shift.find(filters).select("-__v")

    return res.status(201).json(new ApiResponse(200, results, "Shift retrieved successfully."))
})

export const getData = asyncHandler(async (req, res) => {

    const info = await Shift.findById(req.params.id).select("-__v");

    if (!info) {
        throw new ApiError(400, "Shift not found")
    }

    return res.status(200).json(new ApiResponse(200, info, "Shift retrieved successfully"));
})

export const updateData = asyncHandler(async (req, res) => {

    const info = await Shift.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!info) {
        throw new ApiError(404, "Shift not found");
    }

    return res.status(200).json(new ApiResponse(200, info, "Shift updated successfully."));
})

export const deleteData = asyncHandler(async (req, res) => {

    const info = await Shift.findById(req.params.id)

    if (!info) {
        throw new ApiError(404, "Shift not found!")
    }

    await info.deleteOne();

    return res.status(200).json(new ApiResponse(200, {}, "Shift delete successfully."));
})

