import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { LeaveType } from "../models/leaveTypeModel.js";

export const createData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const data = req.body;
    data.companyId = companyId;

    const newLeaveType = await LeaveType.create(data);

    if (!newLeaveType) {
        throw new ApiError(400, "Invalide credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                newLeaveType,
                "Leave type created successfully"
            )
        );
});

export const getAllData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId };
    const leaveTypes = await LeaveType.find(filters).sort({ createdAt: 1 });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                leaveTypes,
                "Leave type retrieved successfully"
            )
        );
});

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const leaveTypeInfo = await LeaveType.findOne(filters);

    if (!leaveTypeInfo) {
        throw new ApiError(400, "Leave type not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                leaveTypeInfo,
                "Leave type retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const leaveTypeInfo = await LeaveType.findOne(filters);

    if (!leaveTypeInfo) {
        throw new ApiError(400, "Leave type not found");
    }

    const updateLeaveType = await LeaveType.findByIdAndUpdate(
        leaveTypeInfo._id,
        req.body,
        {
            new: true,
        }
    );

    if (!updateLeaveType) {
        throw new ApiError(404, "Leave type not found!");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                updateLeaveType,
                "Leave type update successfully"
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";
    const filters = { _id: req.params.id, companyId: companyId };

    const leaveType = await LeaveType.findOne(filters);

    if (!leaveType) {
        throw new ApiError(400, "Leave type not found!");
    }

    await LeaveType.findByIdAndDelete(leaveType._id);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Leave type delete successfully"));
});
