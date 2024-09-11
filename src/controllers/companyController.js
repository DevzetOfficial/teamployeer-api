import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utilities/cloudinary.js";

import { Company } from "../models/companyModel.js";

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const comapny = await Company.findById(companyId);

    if (!comapny) {
        throw new ApiError(400, "Company not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, comapny, "Company retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const companyInfo = Company.findById(companyId);

    if (!companyInfo) {
        throw new ApiError(400, "Company not found");
    }

    const data = req.body;

    let uploadlogo;
    if (req.file && req.file?.path) {
        uploadlogo = await uploadOnCloudinary(req.file?.path);
        data.logo = uploadlogo?.url || "";

        if (companyInfo && companyInfo.logo) {
            await destroyOnCloudinary(companyInfo.logo);
        }
    }

    const company = await Company.findByIdAndUpdate(companyId, data, {
        new: true,
    });

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, company, "Company updated successfully"));
});

export const deleteImage = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const comapny = await Company.findById(companyId);

    if (!comapny) {
        throw new ApiError(400, "Company not found");
    }

    if (comapny.logo) {
        await destroyOnCloudinary(comapny.logo);
    }

    await Company.findByIdAndUpdate(companyId, { logo: "" }, { new: true });

    return res
        .status(201)
        .json(
            new ApiResponse(200, Company, "Company image delete successfully")
        );
});
