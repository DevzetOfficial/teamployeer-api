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

    let leaveTypes;
    if (employeeInfo?.timeoffDate) {
        leaveTypes = employeeInfo.timeoffDate;
    } else {
        leaveTypes = await LeaveType.find({ companyId: companyId })
            .select("name amount")
            .sort({ createdAt: 1 });
    }

    delete filters._id;
    filters.employee = req.params.employeeId;
    filters.status = "Approved";
    const timeoff = await TimeOff.find(filters);

    const newLeaveTypes = leaveTypes.map((row) => {
        const rowObject = row.toObject ? row.toObject() : row;
        const timeoffData = timeoff
            .filter((pRow) => String(pRow.leaveType._id) === String(row._id))
            .reduce((sum, pRow) => sum + pRow.totalDay, 0);

        return {
            ...rowObject,
            taken: timeoffData,
            remaining: row.amount - timeoffData,
        };
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

    const timeoffDate = [];
    for (let i = 0; i < req.body._id.length; i++) {
        const item = {
            _id: req.body._id[i],
            name: req.body.name[i],
            amount: req.body.amount[i],
        };

        timeoffDate.push(item);
    }

    const employee = await Employee.findByIdAndUpdate(
        employeeInfo._id,
        { timeoffDate: timeoffDate },
        { new: true }
    );

    return res
        .status(201)
        .json(
            new ApiResponse(200, employee, "Employee time off set successfully")
        );
});
