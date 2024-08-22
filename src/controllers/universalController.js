import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { Country } from "../models/countryModel.js"
import { EmployeeLevel } from "../models/employeeLevelModel.js"
import { EmployeeType } from "../models/employeeTypeModel.js"
import { CompanyType } from "../models/companyTypeModel.js"
import { CompanySize } from "../models/companySizeModel.js"


// country list
export const countryList = asyncHandler(async (req, res) => {

    const countrys = await Country.find({})

    return res.status(201).json(new ApiResponse(200, countrys, "Country retrieved successfully"))
})


// employee level list
export const employeeLevelList = asyncHandler(async (req, res) => {

    const employeeLevel = await EmployeeLevel.find({})

    return res.status(201).json(new ApiResponse(200, employeeLevel, "Employee level retrieved successfully"))
})


// employee type list
export const employeeTypeList = asyncHandler(async (req, res) => {

    const employeeType = await EmployeeType.find({})

    return res.status(201).json(new ApiResponse(200, employeeType, "Employee type retrieved successfully"))
})


// company type list
export const companyTypeList = asyncHandler(async (req, res) => {

    const companyType = await CompanyType.find({})

    return res.status(201).json(new ApiResponse(200, companyType, "Company type retrieved successfully"))
})


// company size list
export const companySizeList = asyncHandler(async (req, res) => {

    const companySize = await CompanySize.find({})

    return res.status(201).json(new ApiResponse(200, companySize, "Company type retrieved successfully"))
})

