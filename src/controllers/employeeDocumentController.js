import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"
import { uploadOnCloudinary, destroyOnCloudinary } from "../utilities/cloudinary.js"


import { EmployeeDocument } from "../models/employeeDecumentModel.js"
import { Employee } from "../models/employeeModel.js"

export const createData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, _id: req.params.id }

    const employeeInfo = Employee.findOne(filters)

    if(!employeeInfo){
        throw new ApiError(400, "Employee not found!")
    }

    const data = req.body

    data.companyId = employeeInfo.companyId
    data.employeeId = employeeInfo._id

    if(!req.file?.path){
        throw new ApiError(400, "Attachment is required")
    }

    const attachmentPath = await uploadOnCloudinary(req.file?.path)
    data.attachment = attachmentPath?.url || ''

    const newDocument = await EmployeeDocument.create(data);

    if (!newDocument) {
        throw new ApiError(400, "Invalid credentials.")
    }

    return res.status(201).json(new ApiResponse(201, newDocument, "Employee document add successfully."));
})

export const getAllData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, employeeId: req.params.id }

    const documents = await EmployeeDocument.find(filters)

    return res.status(201).json(new ApiResponse(200, documents, "Employee documents retrieved successfully."))
})


export const getData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, _id: req.params.id }

    const employee = await Employee.findOne(filters).populate({path: "supervisor", select: "_id name email mobile avatar"})

    if (!employee) {
        throw new ApiError(400, "Employee not found")
    }

    return res.status(200).json(new ApiResponse(200, employee, "Employee retrieved successfully"));
})

export const updateData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, _id: req.params.id }

    const employeeInfo = await Employee.findOne(filters)

    if (!employeeInfo) {
        throw new ApiError(404, "Employee not found");
    }

    const data = req.body;

    if (req.file && req.file?.path) {
        const uploadAvatar = await uploadOnCloudinary(req.file?.path)
        data.avatar = uploadAvatar?.url || ""

        if (employeeInfo && employeeInfo.avatar) {
            await destroyOnCloudinary(employeeInfo.avatar);
        }
    }

    const employee = await Employee.findOneAndUpdate(
        filters,
        data,
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, employee, "Employee updated successfully."));
})


export const updateOffboarding = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, _id: req.params.id }

    const employeeInfo = await Employee.findOne(filters)
    
    if (!employeeInfo) {
        throw new ApiError(404, "Employee not found");
    }

    const data = req.body;

    if(!data?.offboardingDate){
        throw new ApiError(404, "Offboardin date is required");
    }

    if(!data?.offboardingType){
        throw new ApiError(404, "Offboardin type is required");
    }

    if(!data?.reason){
        throw new ApiError(404, "Reason is required");
    }
    
    data.status = 0

    const employee = await Employee.findOneAndUpdate(
        filters,
        data,
        { new: true }
    );


    return res.status(200).json(new ApiResponse(200, employee, "Employee updated successfully."));
})

export const deleteData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, _id: req.params.id }

    const info = await Employee.findOne(filters)

    if (!info) {
        throw new ApiError(404, "Employee not found!")
    }

    let employee
    if (info.status === 0) {
        employee = await Employee.findByIdAndUpdate(info._id, { status: 1 }, { new: true });
    } else {
        employee = await Employee.findByIdAndUpdate(info._id, { status: 0 }, { new: true });
    }

    return res.status(200).json(new ApiResponse(200, employee, "Employee status update successfully."));
})

