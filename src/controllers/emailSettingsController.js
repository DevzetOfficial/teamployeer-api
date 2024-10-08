import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Company } from "../models/companyModel.js";

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const companyInfo = await Company.findById(companyId).lean();

    if (!companyInfo) {
        throw new ApiError(404, "Company not found");
    }

    const emailSettings = companyInfo?.emailSettings
        ? companyInfo?.emailSettings
        : "";

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                emailSettings,
                "Email settings retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const companyInfo = await Company.findById({ _id: companyId });

    if (!companyInfo) {
        throw new ApiError(404, "Company not found");
    }

    if (!req.body?.emailSettings) {
        throw new ApiError(400, "Email settings is required");
    }

    const company = await Company.findByIdAndUpdate(
        companyId,
        {
            emailSettings: req.body?.emailSettings,
        },
        { new: true }
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                company?.emailSettings,
                "Email settings  update successfully"
            )
        );
});
