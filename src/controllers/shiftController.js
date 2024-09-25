import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { Shift } from "../models/shiftModel.js";

export const createData = asyncHandler(async (req, res) => {
    const formData = req.body;

    let coordinator;
    if (formData.coordinator) {
        coordinator = formData.coordinator;
    }

    const storeData = {
        companyId: req.user?.companyId,
        name: formData.name,
        coordinator: coordinator,
        startTime: formData.startTime,
        endTime: formData.endTime,
        workDays: formData.workDays,
    };

    const newData = await Shift.create(storeData);

    if (!newData) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, newData, "Shift created successfully"));
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const shifts = await Shift.find(filters);

    return res
        .status(201)
        .json(new ApiResponse(200, shifts, "Shift retrieved successfully"));
});

export const getData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const shiftInfo = await Shift.findOne(filters);

    if (!shiftInfo) {
        throw new ApiError(400, "Shift not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, shiftInfo, "Shift retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const shiftInfo = await Shift.findOne(filters);

    if (!shiftInfo) {
        throw new ApiError(400, "Shift not found");
    }

    const updateShift = await Shift.findByIdAndUpdate(shiftInfo._id, req.body, {
        new: true,
    });

    return res
        .status(201)
        .json(new ApiResponse(200, updateShift, "Shift update successfully"));
});

export const deleteData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const shiftInfo = await Shift.findOne(filters);

    if (!shiftInfo) {
        throw new ApiError(400, "Shift not found");
    }

    await Shift.findByIdAndDelete(shiftInfo._id);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Shift delete successfully"));
});
