import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Employee } from "../models/employeeModel.js";
import { Timeoff } from "../models/timeoffModel.js";
import { TimeoffType } from "../models/timeoffTypeModel.js";

export const getAllTimeoff = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId;

    const filters = {
        companyId: companyId,
        _id: req.params.employeeId,
    };

    const employeeInfo = await Employee.findOne(filters);

    if (!employeeInfo) {
        throw new ApiError(400, "Employee not found");
    }

    delete filters._id;
    filters.employee = req.params.employeeId;
    filters.status = "Approved";
    const timeoff = await Timeoff.find(filters);

    const defaultTimeoffTypes = await TimeoffType.find({ companyId: companyId })
        .select("name amount")
        .sort({ createdAt: 1 });

    const newTimeoffTypes = [];
    defaultTimeoffTypes.map((row) => {
        const item = {};

        const leaveTaken = timeoff
            .filter((pRow) => String(pRow.timeoffType._id) === String(row._id))
            .reduce((sum, pRow) => sum + pRow.totalDay, 0);

        if (!employeeInfo?.timeoffDate) {
            item._id = row._id;
            item.name = row.name;
            item.amount = row.amount;
            item.taken = leaveTaken;
            item.remaining = row.amount - leaveTaken;
        } else {
            const employeeleave = employeeInfo?.timeoffDate.filter(
                (lRow) => String(lRow._id) === String(row._id)
            );

            if (employeeleave.length === 0) {
                item._id = row._id;
                item.name = row.name;
                item.amount = row.amount;
                item.taken = leaveTaken;
                item.remaining = row.amount - leaveTaken;
            } else {
                item._id = row._id;
                item.name = row.name;
                item.amount = employeeleave[0].amount;
                item.taken = leaveTaken;
                item.remaining = employeeleave[0].amount - leaveTaken;
            }
        }

        newTimeoffTypes.push(item);
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                newTimeoffTypes,
                "Employee time off retrieved successfully"
            )
        );
});

export const setEmployeeTimeOff = asyncHandler(async (req, res) => {
    const filters = {
        companyId: req.user?.companyId,
        _id: req.params.employeeId,
    };

    const employeeInfo = await Employee.findOne(filters);

    if (!employeeInfo) {
        throw new ApiError(404, "Employee not found");
    }

    if (!req.body?.timeoffs) {
        throw new ApiError(400, "Time off is required");
    }

    const employee = await Employee.findByIdAndUpdate(
        employeeInfo._id,
        { timeoffDate: req.body.timeoffs },
        { new: true }
    );

    return res
        .status(201)
        .json(
            new ApiResponse(200, employee, "Employee time off set successfully")
        );
});
