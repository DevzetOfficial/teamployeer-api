import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { EmployeeLevel } from "../models/employeeLevelModel.js";

export const createData = asyncHandler(async (req, res) => {
    const data = req.body;

    data.companyId = req.user?.companyId;

    const newData = await EmployeeLevel.create(data);

    if (!newData) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, newData, "Employee Level created successfully")
        );
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const allData = await EmployeeLevel.find(filters).select("name").lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                allData,
                "Employee Level retrieved successfully"
            )
        );
});

export const getData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const designation = await EmployeeLevel.findOne(filters)
        .select("name")
        .lean();

    if (!designation) {
        throw new ApiError(404, "Employee Level not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                designation,
                "Employee Level retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const designation = await EmployeeLevel.findOne(filters);

    if (!designation) {
        throw new ApiError(404, "Employee Level not found");
    }

    const updateEmployeeLevel = await EmployeeLevel.findByIdAndUpdate(
        designation._id,
        req.body,
        { new: true }
    );

    if (!updateEmployeeLevel) {
        throw new ApiError(404, "Employee Level not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                updateEmployeeLevel,
                "Employee Level updated successfully."
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const employeeLevel = await EmployeeLevel.findOne(filters);

    if (!employeeLevel) {
        throw new ApiError(404, "Employee Level not found");
    }

    await EmployeeLevel.findByIdAndDelete(employeeLevel._id);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Employee Level delete successfully"));
});
