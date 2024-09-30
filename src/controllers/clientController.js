import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { generateCode, objectId } from "../utilities/helper.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utilities/cloudinary.js";

import { Client } from "../models/clientModel.js";

export const createData = asyncHandler(async (req, res) => {
    const formData = req.body;

    if (!formData.name) {
        throw new ApiError(400, "Client name is required");
    }

    if (!formData.companyName) {
        throw new ApiError(400, "Company name is required");
    }

    let uploadAvatar;
    if (req.file?.path) {
        uploadAvatar = await uploadOnCloudinary(req.file?.path);
    }

    const data = {
        companyId: req.user?.companyId,
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
    };

    const newClient = await Client.create(data).lean();

    if (!newClient) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newClient, "Client created successfully."));
});

export const getActiveData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, status: 1 };

    const clients = await Client.find(filters)
        .populate({
            path: "country",
            select: "name avatar",
        })
        .lean();

    return res
        .status(201)
        .json(new ApiResponse(200, clients, "Client retrieved successfully."));
});

export const getInactiveData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, status: 0 };

    const clients = await Client.find(filters)
        .populate({
            path: "country",
            select: "name avatar",
        })
        .lean();

    return res
        .status(201)
        .json(new ApiResponse(200, clients, "Client retrieved successfully."));
});

export const getCountData = asyncHandler(async (req, res) => {
    const clients = await Client.aggregate([
        {
            $match: {
                companyId: { $eq: req.user?.companyId },
            },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    const clientCount = {
        active: 0,
        inactive: 0,
    };

    if (clients.length > 0) {
        clients.forEach((row) => {
            if (row._id === 1) {
                clientCount.active = row.count;
            }

            if (row._id === 0) {
                clientCount.inactive = row.count;
            }
        });
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, clientCount, "Client retrieved successfully.")
        );
});

export const getData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const client = await Client.findOne(filters).populate({
        path: "country",
        select: "name avatar",
    });

    if (!client) {
        throw new ApiError(400, "Client not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, client, "Client retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const clientInfo = await Client.findOne(filters);

    if (!clientInfo) {
        throw new ApiError(400, "Client not found");
    }

    const data = req.body;

    if (req.file && req.file?.path) {
        const uploadAvatar = await uploadOnCloudinary(req.file?.path);
        data.avatar = uploadAvatar?.url || "";

        if (clientInfo && clientInfo.avatar) {
            await destroyOnCloudinary(clientInfo.avatar);
        }
    }

    const client = await Client.findByIdAndUpdate(clientInfo._id, data, {
        new: true,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, client, "Client updated successfully"));
});

export const deleteData = asyncHandler(async (req, res) => {
    const filters = { _id: req.params.id, companyId: req.user?.companyId };

    const clientInfo = await Client.findOne(filters);

    if (!clientInfo) {
        throw new ApiError(404, "Client not found");
    }

    const client = await Client.findByIdAndUpdate(
        clientInfo._id,
        {
            status: clientInfo.status === 0 ? 1 : 0,
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, client, "Client delete successfully"));
});
