import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { Project } from "../models/projectModel.js";
import { Scrumboard } from "../models/scrumboardModel.js";

export const createData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;
    const projectId = req.params?.projectId;

    const project = await Project.findOne({
        _id: projectId,
        companyId: companyId,
    });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (!req.body?.name) {
        throw new ApiError(400, "Name is required");
    }

    // check exist
    const scrumboardExist = await Scrumboard.findOne({
        companyId: companyId,
        name: req.body.name.trim(),
    });

    if (scrumboardExist) {
        throw new ApiError(400, "Data already exist");
    }

    // get mex position
    const maxPosition = await Scrumboard.findOne({ project: projectId })
        .sort({
            position: -1,
        })
        .select("position")
        .exec();

    const scrumboardData = req.body;

    scrumboardData.project = projectId;
    scrumboardData.position = maxPosition ? maxPosition.position + 1 : 1;

    const scrumboar = await Scrumboard.create(scrumboardData);

    return res
        .status(201)
        .json(new ApiResponse(201, scrumboar, "Task created successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const scrumboardId = req.body?.scrumboardId;
    const projectId = req.params?.projectId;

    const scrumboar = await Scrumboard.findOne({
        _id: scrumboardId,
        project: projectId,
    });

    if (!scrumboar) {
        throw new ApiError(404, "Scrumboard not found");
    }

    delete req.body.scrumboardId;

    const updateScrumboard = await Scrumboard.findByIdAndUpdate(
        scrumboardId,
        req.body,
        {
            new: true,
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updateScrumboard,
                "Scrumboard updated successfully"
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const scrumboardId = req.body?.scrumboardId;
    const projectId = req.params?.projectId;

    const scrumboar = await Scrumboard.findOne({
        _id: scrumboardId,
        project: projectId,
    });

    if (!scrumboar) {
        throw new ApiError(404, "Scrumboard not found");
    }

    // task ids
    const taskItes = await Task.find({
        scrumboard: { $in: scrumboardId },
    })
        .select("_id")
        .lean()
        .then((tasks) => tasks.map((task) => task._id));

    // delete task, taskComment, taskAttachment
    if (taskItes.length > 0) {
        await Task.deleteMany({ _id: { $in: taskItes } });
        await TaskComment.deleteMany({ task: { $in: taskItes } });
        await TaskAttachment.deleteMany({ task: { $in: taskItes } });
    }

    // delete scrumboard
    await Scrumboard.findByIdAndDelete(scrumboardId);

    return res
        .status(200)
        .json(new ApiResponse(200, client, "Client delete successfully"));
});
