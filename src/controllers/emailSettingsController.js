import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { Company } from "../models/companyModel.js";

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const company = await Company.findById(companyId);

    if (!company) {
        throw new ApiError(400, "Company not found");
    }

    const emailSettings = company?.emailSettings ? company?.emailSettings : "";

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                emailSettings,
                "Email settings retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const companyInfo = await Company.findById({ _id: companyId });

    if (!companyInfo) {
        throw new ApiError(400, "Invalid credentials");
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
                201,
                company?.emailConfig,
                "Email config  update successfully"
            )
        );
});
