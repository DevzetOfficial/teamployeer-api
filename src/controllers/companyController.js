import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { objectId } from "../utils/helper.js";

import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utils/cloudinary.js";

import { Company } from "../models/companyModel.js";

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const comapny = await Company.findById(companyId).select(
        "companyName email mobile address startTime endTime logo"
    );

    if (!comapny) {
        throw new ApiError(404, "Company not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, comapny, "Company retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    if (req.body?.email) {
        const existEmail = await Company.findOne({
            email: req.body.email,
            _id: { $ne: companyId },
        });

        if (existEmail) {
            throw new ApiError(400, "Email already exists for another company");
        }
    }

    const companyInfo = Company.findById(companyId);

    if (!companyInfo) {
        throw new ApiError(404, "Company not found");
    }

    const data = req.body;

    let uploadlogo;
    if (req.file && req.file?.path) {
        uploadlogo = await uploadOnCloudinary(req.file?.path);
        data.logo = uploadlogo?.url || "";

        if (companyInfo && companyInfo.logo) {
            await destroyOnCloudinary(companyInfo.logo);
        }
    } else {
        if (!data?.logo) {
            delete data.logo;
        }
    }

    const updateCompany = await Company.findByIdAndUpdate(companyId, data, {
        new: true,
    });

    if (!updateCompany) {
        throw new ApiError(404, "Company not found");
    }

    const comapny = await Company.findById(companyId).select(
        "companyName email mobile address startTime endTime logo"
    );

    return res
        .status(201)
        .json(new ApiResponse(200, comapny, "Company updated successfully"));
});
