import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Company } from "../models/companyModel.js";

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const companyInfo = await Company.findById(companyId);

    if (!companyInfo) {
        throw new ApiError(400, "Policies not found");
    }

    const policies = {
        companyPolicy: companyInfo?.companyPolicy || "",
        medicalBenefits: companyInfo?.medicalBenefits || "",
        festibalBenefits: companyInfo?.festibalBenefits || "",
    };

    return res
        .status(201)
        .json(
            new ApiResponse(200, policies, "Policies retrieved successfully")
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const companyInfo = await Company.findById({ _id: companyId });

    if (!companyInfo) {
        throw new ApiError(404, "Company not found");
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

    const policies = {
        companyPolicy: company?.companyPolicy || "",
        medicalBenefits: company?.medicalBenefits || "",
        festibalBenefits: company?.festibalBenefits || "",
    };

    return res
        .status(201)
        .json(new ApiResponse(200, policies, "Policies update successfully"));
});
