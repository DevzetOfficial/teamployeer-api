import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { Company } from "../models/companyModel.js";

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const policies = await Company.findById(companyId);

    if (!policies) {
        throw new ApiError(400, "Policies not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, policies, "Policies retrieved successfully")
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const companyInfo = await Company.findById({ _id: companyId });

    if (!companyInfo) {
        throw new ApiError(400, "Invalid credentials");
    }

    if (
        !req.body?.companyPolicy &&
        !req.body?.medicalBenefits &&
        !req.body?.festibalBenefits
    ) {
        throw new ApiError(400, "Policies is required");
    }

    const company = await Company.findByIdAndUpdate(companyId, req.body, {
        new: true,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, company, "Policies update successfully"));
});
