import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { Country } from "../models/countryModel.js"
import { EmployeeLevel } from "../models/employeeLevelModel.js"
import { EmployeeType } from "../models/employeeTypeModel.js"

const countryList = asyncHandler(async (req, res) => {

    const countrys = await Country.find({}).select("-__v")

    return res.status(201).json(new ApiResponse(200, countrys, "success"))
})

const employeeLevelList = asyncHandler(async (req, res) => {

    const employeeLevel = await EmployeeLevel.find({}).select("-__v")

    return res.status(201).json(new ApiResponse(200, employeeLevel, "success"))
})

const employeeTypeList = asyncHandler(async (req, res) => {

    const employeeType = await EmployeeType.find({}).select("-__v")

    return res.status(201).json(new ApiResponse(200, employeeType, "success"))
})


export { countryList, employeeLevelList, employeeTypeList }




