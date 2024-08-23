import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"

import { Shift } from "../models/shiftModel.js"


export const createData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66c57d08fff68ef283165008"

    const formData = req.body;

    let coordinator
    if (formData.coordinator) {
        coordinator = formData.coordinator
    }

    const storeData = {
        companyId: companyId,
        name: formData.name,
        coordinator: coordinator,
        startTime: formData.startTime,
        endTime: formData.endTime,
        workDays: formData.workDays,
    }

    const newData = await Shift.create(storeData);

    if (!newData) {
        throw new ApiError(400, "Invalid credentials.")
    }

    return res.status(201).json(new ApiResponse(200, newData, "Shift created successfully."));
})

export const getAllData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66c57d08fff68ef283165008"

    const filters = { companyId: companyId }

    const results = await Shift.find(filters)

    return res.status(201).json(new ApiResponse(200, results, "Shift retrieved successfully."))
})

export const getData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66c57d08fff68ef283165008"

    const filters = { _id: req.params.id, companyId: companyId }

    const info = await Shift.findOne(filters)

    if (!info) {
        throw new ApiError(400, "Shift not found")
    }

    return res.status(201).json(new ApiResponse(200, info, "Shift retrieved successfully"));
})


export const updateData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66c57d08fff68ef283165008"
    const filters = { _id: req.params.id, companyId: companyId }

    const info = await Shift.findOneAndUpdate(
        filters,
        req.body,
        { new: true }
    );

    if (!info) {
        throw new ApiError(404, "Shift not found!")
    }

    return res.status(201).json(new ApiResponse(200, info, "Shift update successfully."));
})

export const deleteData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66c57d08fff68ef283165008"
    const filters = { _id: req.params.id, companyId: companyId }

    const info = await Shift.findOne(filters)

    if (!info) {
        throw new ApiError(400, "Shift not found!")
    }

    let shift
    if (info.status === 0) {
        shift = await Shift.findByIdAndUpdate(info.id, { status: 1 }, { new: true });
    } else {
        shift = await Shift.findByIdAndUpdate(info.id, { status: 0 }, { new: true });
    }

    return res.status(201).json(new ApiResponse(200, shift, "Shift delete successfully."));
})

