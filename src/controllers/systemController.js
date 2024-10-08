import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Company } from "../models/companyModel.js";

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const companyInfo = await Company.findById(companyId).lean();

    if (!companyInfo) {
        throw new ApiError(404, "System settings not found");
    }

    const systemSettings = companyInfo?.systemSettings || "";

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                systemSettings,
                "System settings retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const companyInfo = await Company.findById(companyId);

    if (!companyInfo) {
        throw new ApiError(404, "System settings not found");
    }

    if (!req.body?.systemSettings) {
        throw new ApiError(400, "System settings is required");
    }

    const company = await Company.findByIdAndUpdate(companyId, req.body, {
        new: true,
    });

    const systemSettings = company?.systemSettings || "";

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                systemSettings,
                "System settings update successfully"
            )
        );
});
