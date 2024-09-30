import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { Country } from "../models/countryModel.js";
import { EmployeeLevel } from "../models/employeeLevelModel.js";
import { EmployeeType } from "../models/employeeTypeModel.js";
import { CompanyType } from "../models/companyTypeModel.js";
import { CompanySize } from "../models/companySizeModel.js";
import { ProvationPeriod } from "../models/provationPeriodModel.js";
import { OffboardingType } from "../models/offboardingTypeModel.js";
import { OffboardingReason } from "../models/offboardingReasonModel.js";
import { ProjectStatus } from "../models/projectStatusModel.js";
import { LeaveStatus } from "../models/leaveStatusModel.js";
import { Permission } from "../models/permissionModel.js";

// permission list
export const permissionList = asyncHandler(async (req, res) => {
    const permissions = await Permission.aggregate([
        {
            $group: {
                _id: "$permissionType",
                permissions: { $push: "$$ROOT" },
            },
        },
        {
            $sort: { "permissions.position": 1 },
        },
    ]).lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                permissions,
                "Permission retrieved successfully"
            )
        );
});

// Leave status list
export const leaveStatusList = asyncHandler(async (req, res) => {
    const results = await LeaveStatus.find()
        .select("name")
        .sort({ position: "asc" })
        .lean();

    return res
        .status(201)
        .json(
            new ApiResponse(200, results, "Leave status retrieved successfully")
        );
});

// Project status list
export const projectStatusList = asyncHandler(async (req, res) => {
    const results = await ProjectStatus.find()
        .select("name")
        .sort({ position: "asc" })
        .lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                results,
                "Project status retrieved successfully"
            )
        );
});

// Offboarding reason list
export const offboardingReasonList = asyncHandler(async (req, res) => {
    const results = await OffboardingReason.find()
        .select("name")
        .sort({ position: "asc" })
        .lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                results,
                "Offboarding reason retrieved successfully"
            )
        );
});

// Offboarding type list
export const offboardingTypeList = asyncHandler(async (req, res) => {
    const results = await OffboardingType.find()
        .select("name")
        .sort({ position: "asc" })
        .lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                results,
                "Offboarding type retrieved successfully"
            )
        );
});

// Provation period list
export const provationPeriodList = asyncHandler(async (req, res) => {
    const provationPeriod = await ProvationPeriod.find()
        .select("name month")
        .sort({ position: "asc" })
        .lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                provationPeriod,
                "Provation period retrieved successfully"
            )
        );
});

// country list
export const countryList = asyncHandler(async (req, res) => {
    const countrys = await Country.find().select("name avatar").lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                countrys,
                "Country list retrieved successfully"
            )
        );
});

// country info
export const countryInfo = asyncHandler(async (req, res) => {
    if (!req.params?.id) {
        throw new ApiError(400, "Invalid credentials");
    }

    const country = await Country.findById(req.params.id).lean();

    if (!country) {
        throw new ApiError(400, "Country not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, country, "Country retrieved successfully"));
});

// employee level list
export const employeeLevelList = asyncHandler(async (req, res) => {
    const employeeLevel = await EmployeeLevel.find()
        .select("name")
        .sort({ position: "asc" })
        .lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                employeeLevel,
                "Employee level retrieved successfully"
            )
        );
});

// employee type list
export const employeeTypeList = asyncHandler(async (req, res) => {
    const employeeType = await EmployeeType.find()
        .select("name")
        .sort({ position: "asc" })
        .lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                employeeType,
                "Employee type retrieved successfully"
            )
        );
});

// company type list
export const companyTypeList = asyncHandler(async (req, res) => {
    const companyType = await CompanyType.find().lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                companyType,
                "Company type retrieved successfully"
            )
        );
});

// Company size list
export const companySizeList = asyncHandler(async (req, res) => {
    const companySize = await CompanySize.find()
        .select("name")
        .sort({ position: "asc" })
        .lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                companySize,
                "Company type retrieved successfully"
            )
        );
});
