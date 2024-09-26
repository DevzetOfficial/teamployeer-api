import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { Scrumboard } from "../models/scrumboardModel.js";
import { Project } from "../models/projectModel.js";

export const createData = asyncHandler(async (req, res) => {
    const { projectId, name, color } = req.body;

    const companyId = req.user?.companyId;

    const projectInfo = await Project.findOne({
        _id: projectId,
        companyId: companyId,
    });

    if (!projectInfo) {
        throw new ApiError(400, "Project not found");
    }

    const scrumboardCount = await Scrumboard.countDocuments({
        companyId: companyId,
        projectId: projectId,
    });

    const data = {
        companyId: companyId,
        projectId: projectId,
        name: name,
        color: color,
        position: scrumboardCount + 1,
        tasks: [],
    };

    const newScrumboard = await Scrumboard.create(data);

    if (!newScrumboard) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newScrumboard,
                "Scrumboard create successfully."
            )
        );
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, status: 1 };

    const clients = await Client.find(filters).populate({
        path: "country",
        select: "name avatar",
    });

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
