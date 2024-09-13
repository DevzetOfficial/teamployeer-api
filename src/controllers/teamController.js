import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { Team } from "../models/teamModel.js";

export const createData = asyncHandler(async (req, res) => {
    const formData = req.body;

    if (!formData.name) {
        throw new ApiError(400, "Team name is required");
    }

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const data = {
        companyId: companyId,
        name: formData.name,
    };

    if (formData.teamHead) {
        data.teamHead = formData.teamHead;
    }

    if (formData.employees && Array.isArray(formData.employees)) {
        data.employees = formData.employees;
    }

    const newTeam = await Team.create(data);

    if (!newTeam) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newTeam, "Team created successfully"));
});

export const getAllData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId };

    const teams = await Team.find(filters).select("-__v");

    return res
        .status(201)
        .json(new ApiResponse(200, teams, "Team retrieved successfully"));
});

export const getCountData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const teamList = await Team.find({ companyId }).select(
        "_id name employees"
    );

    const teams = [];

    teamList.map((row) => {
        teams.push({
            _id: row._id,
            name: row.name,
            count: row.employees.length,
        });
    });

    return res
        .status(201)
        .json(new ApiResponse(200, teams, "Team retrieved successfully"));
});

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const team = await Team.findOne(filters)
        .populate({ path: "teamHead", select: "_id, name email mobile avatar" })
        .populate({
            path: "employees",
            select: "employeeId name avatar mobile email",
            populate: { path: "designation", select: "name" },
        });

    if (!team) {
        throw new ApiError(400, "Team not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, team, "Team retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";
    const filters = { companyId: companyId, _id: req.params.id };

    const formData = req.body;

    const data = {
        name: formData.name,
    };

    if (formData.teamHead) {
        data.teamHead = formData.teamHead;
    }

    if (formData.employees && Array.isArray(formData.employees)) {
        data.employees = formData.employees;
    }

    const team = await Team.findOneAndUpdate(filters, data, { new: true });

    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, team, "Team updated successfully"));
});

export const deleteData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";
    const filters = { companyId: companyId, _id: req.params.id };

    const team = await Team.findOne(filters);

    if (!team) {
        throw new ApiError(404, "Team not found!");
    }

    await Team.findOneAndDelete(filters);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Team delete successfully"));
});
