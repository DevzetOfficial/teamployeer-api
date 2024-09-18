import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { Employee } from "../models/employeeModel.js";
import { LeaveType } from "../models/leaveTypeModel.js";
import { TimeOff } from "../models/timeOffModel.js";

export const getAllTimeoff = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.employeeId };

    const employeeInfo = await Employee.findOne(filters);

    if (!employeeInfo) {
        throw new ApiError(404, "Employee not found!");
    }

    delete filters._id;
    filters.employee = req.params.employeeId;
    filters.status = "Approved";
    const timeoff = await TimeOff.find(filters);

    const defaultLeaveTypes = await LeaveType.find({ companyId: companyId })
        .select("name amount")
        .sort({ createdAt: 1 });

    const newLeaveTypes = [];
    defaultLeaveTypes.map((row) => {
        const item = {};

        const leaveTaken = timeoff
            .filter((pRow) => String(pRow.leaveType._id) === String(row._id))
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

        newLeaveTypes.push(item);
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                newLeaveTypes,
                "Employee time off retrieved successfully"
            )
        );
});

export const setEmployeeTimeOff = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.employeeId };

    const employeeInfo = await Employee.findOne(filters);

    if (!employeeInfo) {
        throw new ApiError(404, "Employee not found!");
    }

    if (!req.body?.timeoffs) {
        throw new ApiError(404, "Time off is required");
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
