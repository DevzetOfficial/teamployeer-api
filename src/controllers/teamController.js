import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"

import { Team } from "../models/teamModel.js"

export const createData = asyncHandler(async (req, res) => {

    const formData = req.body;

    if (!formData.name) {
        throw new ApiError(400, "Team name is required");
    }

    const data = {
        //companyId: req.user.companyId,
        companyId: "66bdec36e1877685a60200ac",
        name: formData.name
    };

    if (formData.teamHead) {
        data.teamHead = formData.teamHead;
    }

    if (formData.employees && Array.isArray(formData.employees)) {
        data.employees = formData.employees;
    }

    const newTeam = await Team.create(data);

    if (!newTeam) {
        throw new ApiError(400, "Invalid credentials.")
    }

    return res.status(201).json(new ApiResponse(201, newTeam, "Team created successfully."));
})

export const getAllData = asyncHandler(async (req, res) => {

    const teams = await Team.find().select("-__v")

    return res.status(201).json(new ApiResponse(200, teams, "Team retrieved successfully."))
})

export const getData = asyncHandler(async (req, res) => {

    const team = await Team.findById(req.params.id).select("-__v");

    if (!team) {
        throw new ApiError(400, "Team not found")
    }

    return res.status(200).json(new ApiResponse(200, team, "Team retrieved successfully"));

})

export const updateData = asyncHandler(async (req, res) => {

    const formData = req.body;

    const data = {
        name: formData.name
    };

    if (formData.teamHead) {
        data.teamHead = formData.teamHead;
    }

    if (formData.employees && Array.isArray(formData.employees)) {
        data.employees = formData.employees;
    }

    const team = await Team.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
    );

    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    return res.status(200).json(new ApiResponse(200, team, "Team updated successfully."));
})

export const deleteData = asyncHandler(async (req, res) => {

    const team = await Team.findById(req.params.id)

    if (!team) {
        throw new ApiError(404, "Team not found!")
    }

    await Team.findByIdAndDelete(req.params.id);

    return res.status(200).json(new ApiResponse(200, {}, "Team delete successfully."));
})

