import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { TimeoffType } from "../models/timeoffTypeModel.js";

export const createData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const data = req.body;
    data.companyId = companyId;

    const newTimeoffType = await TimeoffType.create(data);

    if (!newTimeoffType) {
        throw new ApiError(400, "Invalide credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                newTimeoffType,
                "Time off type created successfully"
            )
        );
});

export const getAllData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId };
    const timeoffTypes = await TimeoffType.find(filters)
        .select("name amount")
        .sort({ createdAt: 1 });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                timeoffTypes,
                "Time off type retrieved successfully"
            )
        );
});

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const timeoffType = await TimeoffType.findOne(filters);

    if (!timeoffType) {
        throw new ApiError(400, "Time off type not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                timeoffType,
                "Time off type retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const timeoffType = await TimeoffType.findOne(filters);

    if (!timeoffType) {
        throw new ApiError(400, "Time off type not found");
    }

    const updateTimeoffType = await TimeoffType.findByIdAndUpdate(
        timeoffType._id,
        req.body,
        {
            new: true,
        }
    );

    if (!updateTimeoffType) {
        throw new ApiError(404, "Time off type not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                updateTimeoffType,
                "Time off type update successfully"
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";
    const filters = { _id: req.params.id, companyId: companyId };

    const timeoffType = await TimeoffType.findOne(filters);

    if (!timeoffType) {
        throw new ApiError(400, "Time off type not found");
    }

    await TimeoffType.findByIdAndDelete(timeoffType._id);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Time off type delete successfully"));
});
