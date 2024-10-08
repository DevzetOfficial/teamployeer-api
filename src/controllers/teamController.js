import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Team } from "../models/teamModel.js";
import { Employee } from "../models/employeeModel.js";

export const createData = asyncHandler(async (req, res) => {
    const formData = req.body;

    if (!formData.name) {
        throw new ApiError(400, "Team name is required");
    }

    const data = {
        companyId: req.user?.companyId,
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
        .json(new ApiResponse(200, newTeam, "Team created successfully"));
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const teams = await Team.find(filters).select("name");

    return res
        .status(201)
        .json(new ApiResponse(200, teams, "Team retrieved successfully"));
});

export const getAllMembers = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const members = await Employee.find(filters)
        .select("employeeId name avatar mobile email")
        .populate({ path: "designation", select: "name" });

    return res
        .status(201)
        .json(
            new ApiResponse(200, members, "Team member retrieved successfully")
        );
});

export const getCountData = asyncHandler(async (req, res) => {
    const teamList = await Team.find({ companyId: req.user?.companyId }).select(
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
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const team = await Team.findOne(filters)
        .select("name")
        .populate({
            path: "employees",
            select: "employeeId name avatar mobile email",
            populate: { path: "designation", select: "name" },
        });

    if (!team) {
        throw new ApiError(400, "Team not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, team, "Team retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

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
        throw new ApiError(400, "Team not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, team, "Team updated successfully"));
});

export const deleteData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const team = await Team.findOne(filters);

    if (!team) {
        throw new ApiError(400, "Team not found");
    }

    await Team.findOneAndDelete(filters);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Team delete successfully"));
});
