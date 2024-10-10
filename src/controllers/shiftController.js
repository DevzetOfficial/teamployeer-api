import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { differenceInMinutes, parse } from "date-fns";

import { Shift } from "../models/shiftModel.js";

export const createData = asyncHandler(async (req, res) => {
    const formData = req.body;

    let coordinator;
    if (formData.coordinator) {
        coordinator = formData.coordinator;
    }

    const startTime = parse(formData.startTime, "hh:mm a", new Date());
    const endTime = parse(formData.endTime, "hh:mm a", new Date());

    if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
    }

    // Calculate the total worked minutes
    const workedMinutes = differenceInMinutes(endTime, startTime);
    const workedHours = Math.floor(workedMinutes / 60);
    const remainingMinutes = workedMinutes % 60;

    const storeData = {
        companyId: req.user?.companyId,
        name: formData.name,
        coordinator: coordinator,
        startTime: formData.startTime,
        endTime: formData.endTime,
        workedHours: workedHours + ":" + remainingMinutes,
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

    const shifts = await Shift.find(filters).populate({
        path: "coordinator",
        select: "_id name email",
    });

    return res
        .status(201)
        .json(new ApiResponse(200, shifts, "Shift retrieved successfully"));
});

export const getData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const shiftInfo = await Shift.findOne(filters).populate({
        path: "coordinator",
        select: "_id name email",
    });

    if (!shiftInfo) {
        throw new ApiError(404, "Shift not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, shiftInfo, "Shift retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const shiftInfo = await Shift.findOne(filters);

    if (!shiftInfo) {
        throw new ApiError(404, "Shift not found");
    }

    const formData = req.body;

    const startTime = parse(formData.startTime, "hh:mm a", new Date());
    const endTime = parse(formData.endTime, "hh:mm a", new Date());

    if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
    }

    // Calculate the total worked minutes
    const workedMinutes = differenceInMinutes(endTime, startTime);
    const workedHours = Math.floor(workedMinutes / 60);
    const remainingMinutes = workedMinutes % 60;

    formData.workedHours = workedHours + ":" + remainingMinutes;

    console.log(formData);

    const updateShift = await Shift.findByIdAndUpdate(shiftInfo._id, formData, {
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
        throw new ApiError(404, "Shift not found");
    }

    await Shift.findByIdAndDelete(shiftInfo._id);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Shift delete successfully"));
});
