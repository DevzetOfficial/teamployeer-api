import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { objectId, getSegments, ucfirst } from "../utilities/helper.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utilities/cloudinary.js";

import { Project } from "../models/projectModel.js";

export const createData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    let projectImage;
    if (req.file?.path) {
        projectImage = await uploadOnCloudinary(req.file?.path);
    }

    const data = {
        companyId: companyId,
        name: req.body.name,
        client: req.body.client,
        projectManager: req.body.projectManager,
        submissionDate: req.body.submissionDate,
        assignMembers: req.body?.assignMembers || "",
        projectImage: projectImage?.url || "",
        description: req.body?.description || "",
    };

    const newProject = await Project.create(data);

    if (!newProject) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newProject, "Project created successfully"));
});

export const getAllData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId };

    const segments = getSegments(req.url);

    if (segments?.[1]) {
        filters.status =
            segments[1] === "onhold" ? "On Hold" : ucfirst(segments[1]);
    }

    const projects = await Project.find(filters);

    return res
        .status(201)
        .json(new ApiResponse(200, projects, "Project retrieved successfully"));
});

export const getCountData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const projects = await Project.aggregate([
        {
            $match: {
                companyId: { $eq: objectId(companyId) },
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
        ongoing: 0,
        onhold: 0,
        completed: 0,
        canceled: 0,
    };

    if (projects) {
        projects.forEach((row) => {
            if (row._id === "Ongoing") {
                dataCount.ongoing = row.count;
            }

            if (row._id === "On Hold") {
                dataCount.onhold = row.count;
            }

            if (row._id === "Completed") {
                dataCount.completed = row.count;
            }

            if (row._id === "Canceled") {
                dataCount.canceled = row.count;
            }
        });
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, dataCount, "Project retrieved successfully")
        );
});

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const project = await Project.findOne(filters);

    if (!project) {
        throw new ApiError(400, "Project not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const projectInfo = await Project.findOne(filters);

    if (!projectInfo) {
        throw new ApiError(400, "Project not found");
    }

    const data = {
        name: req.body.name,
        client: req.body.client,
        projectManager: req.body.projectManager,
        submissionDate: req.body.submissionDate,
        assignMembers: req.body?.assignMembers || "",
        description: req.body?.description || "",
    };

    if (req.file?.path) {
        uploadProjectImage = await uploadOnCloudinary(req.file?.path);
        data.projectImage = uploadProjectImage?.url || "";

        if (projectInfo.projectImage) {
            await destroyOnCloudinary(projectInfo.projectImage);
        }
    }

    const updateProject = await Project.findById(projectInfo._id, data, {
        new: true,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, updateProject, "Project updated successfully")
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";
    const filters = { companyId: companyId, _id: req.params.id };

    const team = await Project.findOne(filters);

    if (!team) {
        throw new ApiError(404, "Project not found");
    }

    await Project.findOneAndDelete(filters);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Project delete successfully"));
});
