import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
    calculateWorkedTimeAndOvertime,
    getSegments,
    ucfirst,
} from "../utils/helper.js";

import { Attendance } from "../models/attendanceModel.js";
import { Employee } from "../models/employeeModel.js";

export const createData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const formData = req.body;
    formData.companyId = companyId;

    if (!formData?.employee) {
        throw new ApiError(400, "Employee id is required");
    }

    const employee = await Employee.findOne({
        companyId,
        _id: formData.employee,
    })
        .select("employeeId name")
        .populate({ path: "shift", select: "name workedHours" });

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    console.log(employee);

    // check exist data
    const startDate = new Date(req.query?.date || Date.now());
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    /* const existData = await Attendance.countDocuments({
        employee: formData.employee,
        createdAt: { $gte: startDate, $lt: endDate },
    }); 

    if (existData > 0) {
        throw new ApiError(400, "Employee attendance has already been taken");
    }*/

    if (!formData?.status) {
        throw new ApiError(400, "Satus is required");
    }

    if (formData.checkIn && formData?.checkOut) {
        const calculateTime = calculateWorkedTimeAndOvertime(
            formData.checkIn,
            formData.checkOut,
            employee.shift.workedHours
        );

        const workedHours =
            (calculateTime.workedHours > 0
                ? calculateTime.workedHours + " hrs "
                : "") +
            (calculateTime.workedMinutes > 0
                ? calculateTime.workedMinutes + " mins"
                : "");

        const overtime =
            calculateTime.overtimeMinutes > 0
                ? calculateTime.overtimeMinutes + " mins"
                : "";

        formData.workedHours = workedHours;
        formData.overtime = overtime;
    }

    const newAttendance = await Attendance.create(formData);

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

    const segments = getSegments(req.url);

    if (segments?.[1]) {
        filters.status = ucfirst(segments?.[1]);
    }

    const startDate = new Date(req.query?.date || Date.now());
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    filters.createdAt = { $gte: startDate, $lt: endDate };

    const attendances = await Attendance.find(filters)
        .populate({
            path: "employee",
            select: "employeeId name avatar",
            populate: {
                path: "designation",
                select: "name",
            },
        })
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

export const getCountData = asyncHandler(async (req, res) => {
    const startDate = new Date(req.query?.date || Date.now());
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const attachments = await Attendance.aggregate([
        {
            $match: {
                companyId: { $eq: req.user?.companyId },
                createdAt: { $gte: startDate, $lt: endDate },
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
        present: 0,
        absent: 0,
        late: 0,
    };

    if (attachments) {
        attachments.forEach((row) => {
            if (row._id === "Present") {
                dataCount.present = row.count;
            }

            if (row._id === "Absent") {
                dataCount.absent = row.count;
            }

            if (row._id === "Late") {
                dataCount.late = row.count;
            }
        });
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, dataCount, "Attendance retrieved successfully")
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const attensdance = await Attendance.findOne(filters).lean();

    if (!attensdance) {
        throw new ApiError(404, "Attensance not found");
    }

    const formData = req.body;

    if (!formData?.status) {
        throw new ApiError(400, "Satus is required");
    }

    if (formData.checkIn && formData?.checkOut) {
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

        formData.workedHours = workedHours;
        formData.overtime = overtime;
    }

    const updateAttendance = await Attendance.findByIdAndUpdate(
        attensdance._id,
        formData,
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
