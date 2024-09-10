import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { LeaveType } from "../models/leaveTypeModel.js";

export const createData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const formData = req.body;

    const storeData = {
        companyId: companyId,
        name: formData.name,
        coordinator: coordinator,
        startTime: formData.startTime,
        endTime: formData.endTime,
        workDays: formData.workDays,
    };

    const newData = await LeaveType.create(storeData);

    if (!newData) {
        throw new ApiError(400, "Invalid credentials.");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, newData, "LeaveType created successfully."));
});

export const getAllData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId };

    const results = await LeaveType.find(filters);

    return res
        .status(201)
        .json(
            new ApiResponse(200, results, "LeaveType retrieved successfully.")
        );
});

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { _id: req.params.id, companyId: companyId };

    const info = await LeaveType.findOne(filters);

    if (!info) {
        throw new ApiError(400, "LeaveType not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, info, "LeaveType retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";
    const filters = { _id: req.params.id, companyId: companyId };

    const info = await LeaveType.findOneAndUpdate(filters, req.body, {
        new: true,
    });

    if (!info) {
        throw new ApiError(404, "LeaveType not found!");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, info, "LeaveType update successfully."));
});

export const deleteData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";
    const filters = { _id: req.params.id, companyId: companyId };

    const LeaveType = await LeaveType.findOne(filters);

    if (!LeaveType) {
        throw new ApiError(400, "LeaveType not found!");
    }

    await LeaveType.findOneAndDelete(filters);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "LeaveType delete successfully."));
});
