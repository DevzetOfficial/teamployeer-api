import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getSegments, objectId, ucfirst } from "../utils/helper.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utils/cloudinary.js";

import { Project } from "../models/projectModel.js";
import { Scrumboard } from "../models/scrumboardModel.js";
import { Task } from "../models/taskModel.js";
import { Subtask } from "../models/subtaskModel.js";
import { TaskComment } from "../models/taskCommentModel.js";
import { TaskAttachment } from "../models/taskAttachmentModel.js";
import { Client } from "../models/clientModel.js";

export const createData = asyncHandler(async (req, res) => {
    let projectImage;
    if (req.file?.path) {
        projectImage = await uploadOnCloudinary(req.file?.path);
    }

    if (!req.body?.client) {
        throw new ApiError(400, "Client is required");
    }

    const members = JSON.parse(req.body.members.replace(/'/g, '"'))
        .filter((id) => id)
        .map((id) => objectId(id));

    const data = {
        companyId: req.user?.companyId,
        name: req.body.name,
        client: req.body.client,
        projectManager: req.body.projectManager,
        submissionDate: req.body.submissionDate,
        members: members,
        projectImage: projectImage?.url || "",
        description: req.body?.description || "",
    };

    const newProject = await Project.create(data);

    if (!newProject) {
        throw new ApiError(400, "Invalid credentials");
    }

    // set default scrumboards column
    await createDefaultScrumboards(newProject._id);

    return res
        .status(201)
        .json(new ApiResponse(200, newProject, "Project created successfully"));
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const segments = getSegments(req.url);

    if (segments?.[1]) {
        filters.status =
            segments[1] === "onhold" ? "On Hold" : ucfirst(segments[1]);
    }

    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find(filters)
        .populate({ path: "client", select: "name source avatar" })
        .populate({ path: "projectManager", select: "name avatar" })
        .populate({
            path: "members",
            select: "name avatar",
            populate: {
                path: "designation",
                model: "Designation",
                select: "name",
            },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const totalItems = await Project.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / limit);

    const newProjects = projects.map((row) => {
        return {
            ...row,
            progress: 0,
        };
    });

    return res.status(201).json(
        new ApiResponse(
            200,
            {
                results: newProjects,
                currentPage: page,
                totalPage: totalPages,
                firstPage: 1,
                lastPage: totalPages,
                totalItems: totalItems,
            },
            "Project retrieved successfully"
        )
    );
});

export const getCountData = asyncHandler(async (req, res) => {
    const projects = await Project.aggregate([
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

    dataCount.all =
        dataCount.ongoing +
        dataCount.onhold +
        dataCount.completed +
        dataCount.canceled;

    return res
        .status(201)
        .json(
            new ApiResponse(200, dataCount, "Project retrieved successfully")
        );
});

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;
    const projectId = req.params.id;
    const filters = { companyId: companyId, _id: projectId };

    const project = await Project.findOne(filters)
        .populate({ path: "client", select: "name source avatar" })
        .populate({ path: "projectManager", select: "name avatar" })
        .populate({
            path: "members",
            select: "name avatar",
            populate: {
                path: "designation",
                model: "Designation",
                select: "name",
            },
        })
        .lean();

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const scrumboards = await Scrumboard.find({
        project: project._id,
    })
        .select("name color tasks position")
        .sort({ position: 1 })
        .populate({
            path: "tasks",
            populate: [
                {
                    path: "user",
                    model: "User",
                    select: "fullName avatar",
                },
                {
                    path: "members",
                    model: "Employee",
                    select: "name avatar",
                },
                {
                    path: "subtasks",
                    model: "Subtask",
                },
                {
                    path: "attachments",
                    model: "TaskAttachment",
                },
                {
                    path: "comments",
                    select: "taskId message createdAt",
                    options: { sort: { createdAt: -1 } },
                    populate: {
                        path: "replies",
                        select: "taskId message createdAt",
                    },
                },
            ],
        });

    scrumboards.forEach((scrumboard) => {
        if (scrumboard.tasks) {
            scrumboard.tasks.sort((a, b) => a.position - b.position);

            if (scrumboard.tasks.subtasks) {
                scrumboard.tasks.subtasks.sort(
                    (a, b) => a.position - b.position
                );
            }
        }
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { project, scrumboards },
                "Project retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const projectInfo = await Project.findOne(filters).lean();

    if (!projectInfo) {
        throw new ApiError(404, "Project not found");
    }

    const data = req.body;

    if (req.body?.members) {
        const members = JSON.parse(req.body.members.replace(/'/g, '"'))
            .filter((id) => id)
            .map((id) => objectId(id));
        data.members = members;
    } else {
        if (data?.members == "") {
            delete data.members;
        }
    }

    if (req.file?.path) {
        const projectImage = await uploadOnCloudinary(req.file?.path);
        data.projectImage = projectImage?.url || "";

        if (projectInfo.projectImage) {
            await destroyOnCloudinary(projectInfo.projectImage);
        }
    }

    if (req.body?.projectImage == "") {
        delete req.body.projectImage;
    }

    const updateProject = await Project.findByIdAndUpdate(
        projectInfo._id,
        data,
        {
            new: true,
        }
    );

    return res
        .status(201)
        .json(
            new ApiResponse(200, updateProject, "Project updated successfully")
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const project = await Project.findOne(filters);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // scrumboard ids
    const scrumboardIds = await Scrumboard.find({ project: project._id })
        .select("_id")
        .lean()
        .then((scrumboards) => scrumboards.map((scrumboard) => scrumboard._id));

    // task ids
    const taskIds = await Task.find({
        scrumboard: { $in: scrumboardIds },
    })
        .select("_id")
        .lean()
        .then((tasks) => tasks.map((task) => task._id));

    // delete task, taskComment, taskAttachment
    if (taskIds.length > 0) {
        await Task.deleteMany({ _id: { $in: taskIds } });
        await Subtask.deleteMany({ taskId: { $in: taskIds } });
        await TaskComment.deleteMany({ taskId: { $in: taskIds } });
        await TaskAttachment.deleteMany({ taskId: { $in: taskIds } });
    }

    if (scrumboardIds.length > 0) {
        await Scrumboard.deleteMany({ _id: { $in: scrumboardIds } });
    }

    await Project.findByIdAndDelete(project._id);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Project delete successfully"));
});

// default scrumboard list
export const createDefaultScrumboards = async (projectId) => {
    const defaultScrumboards = [
        {
            project: projectId,
            name: "To Do",
            color: "#D9D9D9",
            tasks: [],
            position: 1,
        },
        {
            project: projectId,
            name: "In Progress",
            color: "#B8D4FF",
            tasks: [],
            position: 2,
        },
        {
            project: projectId,
            name: "In Review",
            color: "#FFDEB8",
            tasks: [],
            position: 3,
        },
        {
            project: projectId,
            name: "Complete",
            color: "#CCE7DE",
            tasks: [],
            position: 4,
        },
    ];

    await Scrumboard.create(defaultScrumboards);
};
