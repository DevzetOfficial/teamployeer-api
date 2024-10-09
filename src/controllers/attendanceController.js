import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Attendance } from "../models/attendanceModel.js";
import { calculateWorkedTimeAndOvertime } from "../utils/helper.js";

export const createData = asyncHandler(async (req, res) => {
    const formData = req.body;

    if (!formData?.employee) {
        throw new ApiError(400, "Employee id is required");
    }

    if (!formData?.checkIn) {
        throw new ApiError(400, "Check in is required");
    }

    if (!formData?.checkOut) {
        throw new ApiError(400, "Check out is required");
    }

    if (!formData?.status) {
        throw new ApiError(400, "Satus is required");
    }

    const calculateTime = calculateWorkedTimeAndOvertime(
        formData.checkIn,
        formData.checkOut
    );

    const workedHours =
        calculateTime.workedHours +
        " hrs " +
        (calculateTime.workedMinutes > 0
            ? calculateTime.workedMinutes + " mins"
            : "");

    const overtime =
        calculateTime.overtimeMinutes > 0
            ? calculateTime.overtimeMinutes + " mins"
            : "";

    const data = formData;
    data.companyId = req.user?.companyId;
    data.workedHours = workedHours;
    data.overtime = overtime;

    const newAttendance = await Attendance.create(data);

    if (!newAttendance) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                newAttendance,
                "Attendance created successfully"
            )
        );
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const startDate = new Date(req.query?.date || Date.now());
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    filters.createdAt = { $gte: startDate, $lt: endDate };

    const attendances = await Attendance.find(filters)
        .populate({ path: "employee", select: "employeeId name avatar" })
        .lean();

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                attendances,
                "Attendance retrieved successfully"
            )
        );
});

export const getData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const attensdance = await Attendance.findOne(filters)
        .populate({ path: "employee", select: "employeeId name avatar" })
        .lean();

    if (!attensdance) {
        throw new ApiError(404, "Attensance not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                attensdance,
                "Attensance retrieved successfully"
            )
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const attensdance = await Attendance.findOne(filters).lean();

    if (!attensdance) {
        throw new ApiError(404, "Attensance not found");
    }

    const formData = req.body;

    if (!formData?.checkIn) {
        throw new ApiError(400, "Check in is required");
    }

    if (!formData?.checkOut) {
        throw new ApiError(400, "Check out is required");
    }

    if (!formData?.status) {
        throw new ApiError(400, "Satus is required");
    }

    const calculateTime = calculateWorkedTimeAndOvertime(
        formData.checkIn,
        formData.checkOut
    );

    const workedHours =
        calculateTime.workedHours +
        " hrs " +
        (calculateTime.workedMinutes > 0
            ? calculateTime.workedMinutes + " mins"
            : "");

    const overtime =
        calculateTime.overtimeMinutes > 0
            ? calculateTime.overtimeMinutes + " mins"
            : "";

    const data = {
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        workedHours: workedHours,
        overtime: overtime,
        status: formData.status,
    };

    const updateAttendance = await Attendance.findByIdAndUpdate(
        attensdance._id,
        data,
        {
            new: true,
        }
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                updateAttendance,
                "Attendance updated successfully"
            )
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const attensdance = await Attendance.findOne(filters).lean();

    if (!attensdance) {
        throw new ApiError(404, "Attensance not found");
    }

    await Attendance.findByIdAndDelete(attensdance._id);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Attendance delete successfully"));
});
