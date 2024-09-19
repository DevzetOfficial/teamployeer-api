import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { objectId } from "../utilities/helper.js";

import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utilities/cloudinary.js";

import { Company } from "../models/companyModel.js";

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const comapny = await Company.findById(companyId).select(
        "companyName email mobile address startTime endTime logo"
    );

    if (!comapny) {
        throw new ApiError(400, "Company not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, comapny, "Company retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    if (req.body?.email) {
        const existEmail = await Company.findOne({
            email: req.body.email,
            _id: { $ne: objectId(companyId) },
        });

        if (existEmail) {
            throw new ApiError(400, "Email already exists for another company");
        }
    }

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
