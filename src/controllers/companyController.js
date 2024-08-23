import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"

import { Company } from "../models/companyModel.js"


export const getData = asyncHandler(async (req, res) => {

    const companyId = "66c57d08fff68ef283165008";

    const comapny = await Company.findById(companyId);

    if (!comapny) {
        throw new ApiError(400, "Company not found")
    }

    return res.status(200).json(new ApiResponse(200, comapny, "Company retrieved successfully"));

})

export const updateData = asyncHandler(async (req, res) => {

    const companyId = "66c57d08fff68ef283165008";

    const info = Company.findById(companyId);

    const data = req.body

    let uploadlogo
    if (req.file && req.file?.path) {
        uploadlogo = await uploadOnCloudinary(req.file?.path)
        data.logo = uploadlogo?.url || ""

        if (info && info.logo) {
            await destroyOnCloudinary(info.logo);
        }
    }

    const company = await Company.findByIdAndUpdate(
        companyId,
        data,
        { new: true }
    );

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    return res.status(200).json(new ApiResponse(200, company, "Company updated successfully."));
})
