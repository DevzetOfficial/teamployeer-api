import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateCode, getSegments } from "../utils/helper.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utils/cloudinary.js";

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

    const newClient = await Client.create(data);

    if (!newClient) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, newClient, "Client created successfully."));
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const segments = getSegments(req.url);

    if (segments?.[1]) {
        if (segments?.[1] === "inactive") {
            filters.status = 0;
        } else {
            throw new ApiError(400, "Invalid credential");
        }
    } else {
        filters.status = 1;
    }

    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const clients = await Client.find(filters)
        .populate({
            path: "country",
            select: "name avatar",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalItems = await Client.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(201).json(
        new ApiResponse(
            200,
            {
                results: clients,
                currentPage: page,
                totalPage: totalPages,
                firstPage: 1,
                lastPage: totalPages,
                totalItems: totalItems,
            },
            "Client retrieved successfully."
        )
    );
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

    const dataCount = {
        all: 0,
        active: 0,
        inactive: 0,
    };

    if (clients.length > 0) {
        clients.forEach((row) => {
            if (row._id === 1) {
                dataCount.active = row.count;
            }

            if (row._id === 0) {
                dataCount.inactive = row.count;
            }
        });
    }

    dataCount.all = dataCount.active + dataCount.inactive;

    return res
        .status(201)
        .json(
            new ApiResponse(200, dataCount, "Client retrieved successfully.")
        );
});

export const getData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const client = await Client.findOne(filters);

    if (!client) {
        throw new ApiError(404, "Client not found");
    }

    const transactions = [];
    const projects = [];

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { client, projects, transactions },
                "Client retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const clientInfo = await Client.findOne(filters);

    if (!clientInfo) {
        throw new ApiError(404, "Client not found");
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
        .status(201)
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
        .status(201)
        .json(new ApiResponse(200, client, "Client delete successfully"));
});
