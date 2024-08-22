import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"
import { generateCode } from "../utilities/helper.js"
import { uploadOnCloudinary, destroyOnCloudinary } from "../utilities/cloudinary.js"


import { Employee } from "../models/employeeModel.js"

export const createData = asyncHandler(async (req, res) => {

    const formData = req.body;

    if (!formData.name) {
        throw new ApiError(400, "Employee name is required");
    }

    if (!formData.companyName) {
        throw new ApiError(400, "Company name is required");
    }

    let uploadAvatar
    if (req.file?.path) {
        uploadAvatar = await uploadOnCloudinary(req.file?.path)
    }

    const data = {
        //companyId: req.user.companyId,
        companyId: "66bdec36e1877685a60200ac",
        clientId: generateCode(7),
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        country: formData.country,
        source: formData.source,
        sourceLink: formData.sourceLink,
        avatar: uploadAvatar?.url || "",
        note: formData.note,
    }

    const newEmployee = await Employee.create(data);

    if (!newEmployee) {
        throw new ApiError(400, "Invalid credentials.")
    }

    return res.status(201).json(new ApiResponse(201, newEmployee, "Employee created successfully."));
})

export const getActiveData = asyncHandler(async (req, res) => {

    const clients = await Employee.find({ status: 1 }).select("-__v")

    return res.status(201).json(new ApiResponse(200, clients, "Employee retrieved successfully."))
})


export const getInactiveData = asyncHandler(async (req, res) => {

    const clients = await Employee.find({ status: 0 }).select("-__v")

    return res.status(201).json(new ApiResponse(200, clients, "Employee retrieved successfully."))
})

export const getCountData = asyncHandler(async (req, res) => {

    const clients = await Employee.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    let active, inactive = 0;

    if (clients) {
        clients.forEach(row => {

            if (row._id === 1) {
                active = row.count
            }

            if (row._id === 0) {
                inactive = row.count
            }
        })
    }

    return res.status(201).json(new ApiResponse(200, { active, inactive }, "Employee retrieved successfully."))
})

export const getData = asyncHandler(async (req, res) => {

    const client = await Employee.findById(req.params.id).select("-__v");

    if (!client) {
        throw new ApiError(400, "Employee not found")
    }

    return res.status(200).json(new ApiResponse(200, client, "Employee retrieved successfully"));
})

export const updateData = asyncHandler(async (req, res) => {

    const clientInfo = await Employee.findById(req.params.id)

    const data = req.body;

    let uploadAvatar
    if (req.file && req.file?.path) {
        uploadAvatar = await uploadOnCloudinary(req.file?.path)
        data.avatar = uploadAvatar?.url || ""

        if (clientInfo && clientInfo.avatar) {
            await destroyOnCloudinary(clientInfo.avatar);
        }
    }

    const client = await Employee.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
    );

    if (!client) {
        throw new ApiError(404, "Employee not found");
    }

    return res.status(200).json(new ApiResponse(200, client, "Employee updated successfully."));
})

export const deleteData = asyncHandler(async (req, res) => {

    const client = await Employee.findById(req.params.id)

    if (!client) {
        throw new ApiError(404, "Employee not found!")
    }

    if (client.status === 0) {
        await Employee.findByIdAndUpdate(req.params.id, { status: 1 }, { new: true });
    } else {
        await Employee.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });
    }

    return res.status(200).json(new ApiResponse(200, {}, "Employee delete successfully."));
})

