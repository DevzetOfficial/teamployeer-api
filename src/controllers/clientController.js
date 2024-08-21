import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"
import { generateCode } from "../utilities/helper.js"
import { uploadOnCloudinary, destroyOnCloudinary } from "../utilities/cloudinary.js"


import { Client } from "../models/clientModel.js"

export const createData = asyncHandler(async (req, res) => {

    const formData = req.body;


    if (!formData.name) {
        throw new ApiError(400, "Client name is required");
    }

    if (!formData.companyName) {
        throw new ApiError(400, "Company name is required");
    }

    let uploadAvatar
    if (req.file.path) {
        uploadAvatar = await uploadOnCloudinary(req.file.path)
    }

    const data = {
        companyId: req.user.companyId,
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

    const newClient = await Client.create(data);

    if (!newClient) {
        throw new ApiError(400, "Invalid credentials.")
    }

    return res.status(201).json(new ApiResponse(201, newClient, "Client created successfully."));
})

export const getAllData = asyncHandler(async (req, res) => {

    const clients = await Client.find().select("-__v")

    return res.status(201).json(new ApiResponse(200, clients, "Client retrieved successfully."))
})

export const getData = asyncHandler(async (req, res) => {

    const client = await Client.findById(req.params.id).select("-__v");

    if (!client) {
        throw new ApiError(400, "Client not found")
    }

    return res.status(200).json(new ApiResponse(200, client, "Client retrieved successfully"));

})

export const updateData = asyncHandler(async (req, res) => {

    const clientInfo = await Client.findById(req.params.id)

    const data = req.body;

    let uploadAvatar
    if (req.file && req.file.path) {
        uploadAvatar = await uploadOnCloudinary(req.file.path)
        data.avatar = uploadAvatar?.url || ""

        if (clientInfo && clientInfo.avatar) {
            await destroyOnCloudinary(clientInfo.avatar);
        }
    }

    const client = await Client.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
    );

    if (!client) {
        throw new ApiError(404, "Client not found");
    }

    return res.status(200).json(new ApiResponse(200, client, "Client updated successfully."));
})

export const deleteData = asyncHandler(async (req, res) => {

    const client = await Client.findById(req.params.id)

    if (!client) {
        throw new ApiError(404, "Client not found!")
    }

    if (client.status === 0) {
        await Client.findByIdAndDelete(req.params.id);
    } else {
        await Client.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });
    }

    return res.status(200).json(new ApiResponse(200, {}, "Client delete successfully."));
})

