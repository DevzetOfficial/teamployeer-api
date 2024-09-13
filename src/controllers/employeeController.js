import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { generateCode, objectId } from "../utilities/helper.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utilities/cloudinary.js";

import { Employee } from "../models/employeeModel.js";
import { Team } from "../models/teamModel.js";

export const createData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const data = req.body;

    data.companyId = companyId;
    data.employeeId = generateCode(5);

    if (!data.supervisor) {
        delete data.supervisor;
    }

    if (req.file?.path) {
        const uploadAvatar = await uploadOnCloudinary(req.file?.path);
        data.avatar = uploadAvatar?.url || "";
    }

    const newEmployee = await Employee.create(data);

    if (!newEmployee) {
        throw new ApiError(400, "Invalid credentials");
    }

    // update team employees
    const updateTeam = await Team.findByIdAndUpdate(
        newEmployee.team,
        { $push: { employees: newEmployee._id } },
        { new: true }
    ).populate("employees");

    if (!updateTeam) {
        throw new ApiError(400, "Invalid team credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, newEmployee, "Employee created successfully")
        );
});

export const getActiveData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, status: 1 };

    const clients = await Employee.find(filters)
        .select("employeeId name avatar email mobile onboardingDate")
        .populate({ path: "designation", select: "name" })
        .populate({ path: "shift", select: "name" })
        .populate({ path: "provationPeriod", select: "name" })
        .populate({ path: "supervisor", select: "name avatar" });

    return res
        .status(201)
        .json(new ApiResponse(200, clients, "Employee retrieved successfully"));
});

export const getInactiveData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, status: 0 };

    const clients = await Employee.find(filters)
        .select("employeeId name avatar email mobile onboardingDate")
        .populate({ path: "designation", select: "name" })
        .populate({ path: "shift", select: "name" })
        .populate({ path: "provationPeriod", select: "name" })
        .populate({ path: "supervisor", select: "name avatar" });

    return res
        .status(201)
        .json(new ApiResponse(200, clients, "Employee retrieved successfully"));
});

export const getCountData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const employees = await Employee.aggregate([
        {
            $match: {
                companyId: { $eq: objectId(companyId) },
            },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    let active = 0;
    let inactive = 0;

    if (employees) {
        employees.forEach((row) => {
            if (row._id === 1) {
                active = row.count;
            }

            if (row._id === 0) {
                inactive = row.count;
            }
        });
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { active, inactive },
                "Employee retrieved successfully"
            )
        );
});

export const getData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const employee = await Employee.findOne(filters)
        .populate({ path: "employeeType", select: "name" })
        .populate({ path: "team", select: "name" })
        .populate({ path: "provationPeriod", select: "name" })
        .populate({ path: "designation", select: "name" })
        .populate({ path: "employeeLevel", select: "name" })
        .populate({ path: "shift", select: "name" })
        .populate({ path: "offboardingType", select: "name" })
        .populate({ path: "reason", select: "name" })
        .populate({ path: "supervisor", select: "name avatar" });

    if (!employee) {
        throw new ApiError(400, "Employee not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, employee, "Employee retrieved successfully")
        );
});

export const updateData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const employeeInfo = await Employee.findOne(filters);

    if (!employeeInfo) {
        throw new ApiError(404, "Employee not found");
    }

    const data = req.body;

    if (req.file && req.file?.path) {
        const uploadAvatar = await uploadOnCloudinary(req.file?.path);
        data.avatar = uploadAvatar?.url || "";

        if (employeeInfo && employeeInfo.avatar) {
            await destroyOnCloudinary(employeeInfo.avatar);
        }
    }

    const employee = await Employee.findOneAndUpdate(filters, data, {
        new: true,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, employee, "Employee updated successfully"));
});

export const updateOffboarding = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const employeeInfo = await Employee.findOne(filters);

    if (!employeeInfo) {
        throw new ApiError(404, "Employee not found");
    }

    const data = req.body;

    if (!data?.offboardingDate) {
        throw new ApiError(404, "Offboardin date is required");
    }

    if (!data?.offboardingType) {
        throw new ApiError(404, "Offboardin type is required");
    }

    if (!data?.reason) {
        throw new ApiError(404, "Reason is required");
    }

    data.status = 0;

    const employee = await Employee.findOneAndUpdate(filters, data, {
        new: true,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, employee, "Employee updated successfully"));
});

export const deleteData = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, _id: req.params.id };

    const info = await Employee.findOne(filters);

    if (!info) {
        throw new ApiError(404, "Employee not found!");
    }

    let employee;
    if (info.status === 0) {
        employee = await Employee.findByIdAndUpdate(
            info._id,
            { status: 1 },
            { new: true }
        );
    } else {
        employee = await Employee.findByIdAndUpdate(
            info._id,
            { status: 0 },
            { new: true }
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                employee,
                "Employee status update successfully"
            )
        );
});

export const getSelectList = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const filters = { companyId: companyId, status: 1 };

    const clients = await Employee.find(filters).select("name avatar");

    return res
        .status(201)
        .json(new ApiResponse(200, clients, "Employee retrieved successfully"));
});

export const getEmployeeRatio = asyncHandler(async (req, res) => {
    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const currentDate = new Date();

    const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );

    const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
    );

    const totalEmployee = await totalEmployeeRatio(
        startDate,
        endDate,
        companyId
    );

    const totalActiveEmployee = await totalActiveEmployeeRatio(
        startDate,
        endDate,
        companyId
    );

    const totalInactiveEmployee = await totalInactiveEmployeeRatio(
        startDate,
        endDate,
        companyId
    );

    const totalNewEmployee = await totalNewEmployeeRatio(
        startDate,
        endDate,
        companyId
    );

    return res.status(201).json(
        new ApiResponse(
            200,
            {
                totalEmployee: totalEmployee,
                totalActiveEmployee: totalActiveEmployee,
                totalInactiveEmployee: totalInactiveEmployee,
                totalNewEmployee: totalNewEmployee,
            },
            "Employee ratio retrieved successfully"
        )
    );
});

async function totalEmployeeRatio(startDate, endDate, companyId) {
    const employeeCount = await Employee.aggregate([
        {
            $match: {
                companyId: { $eq: objectId(companyId) },
            },
        },
        {
            $facet: {
                currentMonth: [
                    {
                        $match: {
                            onboardingDate: {
                                $gte: startDate,
                                $lt: endDate,
                            },
                        },
                    },
                    { $count: "count" },
                ],
                previousMonth: [
                    {
                        $match: {
                            onboardingDate: {
                                $lt: startDate,
                            },
                        },
                    },
                    { $count: "count" },
                ],
            },
        },
    ]);

    const currentMonthCount = employeeCount[0].currentMonth[0]?.count || 0;
    const previousMonthCount = employeeCount[0].previousMonth[0]?.count || 0;

    const totalEmployees = previousMonthCount + currentMonthCount;

    let employeeRatio;

    if (previousMonthCount === 0) {
        employeeRatio = totalEmployees > 0 ? 100 : 0;
    } else if (totalEmployees === previousMonthCount) {
        employeeRatio = 0;
    } else {
        employeeRatio =
            ((totalEmployees - previousMonthCount) / previousMonthCount) * 100;
    }

    // Restrict the ratio between -100 and 100
    employeeRatio = Math.max(-100, Math.min(100, employeeRatio));

    return {
        count: totalEmployees,
        ratio: employeeRatio,
    };
}

async function totalActiveEmployeeRatio(startDate, endDate, companyId) {
    const employeeCount = await Employee.aggregate([
        {
            $match: {
                companyId: { $eq: objectId(companyId) },
                status: { $eq: 1 },
            },
        },
        {
            $facet: {
                currentMonth: [
                    {
                        $match: {
                            onboardingDate: {
                                $gte: startDate,
                                $lt: endDate,
                            },
                        },
                    },
                    { $count: "count" },
                ],
                previousMonth: [
                    {
                        $match: {
                            onboardingDate: {
                                $lt: startDate,
                            },
                        },
                    },
                    { $count: "count" },
                ],
            },
        },
    ]);

    const currentMonthCount = employeeCount[0].currentMonth[0]?.count || 0;
    const previousMonthCount = employeeCount[0].previousMonth[0]?.count || 0;

    const totalEmployees = previousMonthCount + currentMonthCount;

    let employeeRatio;

    if (previousMonthCount === 0) {
        employeeRatio = totalEmployees > 0 ? 100 : 0;
    } else if (totalEmployees === previousMonthCount) {
        employeeRatio = 0;
    } else {
        employeeRatio =
            ((totalEmployees - previousMonthCount) / previousMonthCount) * 100;
    }

    // Restrict the ratio between -100 and 100
    employeeRatio = Math.max(-100, Math.min(100, employeeRatio));

    return {
        count: totalEmployees,
        ratio: employeeRatio,
    };
}

async function totalInactiveEmployeeRatio(startDate, endDate, companyId) {
    const employeeCount = await Employee.aggregate([
        {
            $match: {
                companyId: { $eq: objectId(companyId) },
                status: { $eq: 0 },
            },
        },
        {
            $facet: {
                currentMonth: [
                    {
                        $match: {
                            onboardingDate: {
                                $gte: startDate,
                                $lt: endDate,
                            },
                        },
                    },
                    { $count: "count" },
                ],
                previousMonth: [
                    {
                        $match: {
                            onboardingDate: {
                                $lt: startDate,
                            },
                        },
                    },
                    { $count: "count" },
                ],
            },
        },
    ]);

    const currentMonthCount = employeeCount[0].currentMonth[0]?.count || 0;
    const previousMonthCount = employeeCount[0].previousMonth[0]?.count || 0;

    const totalEmployees = previousMonthCount + currentMonthCount;

    let employeeRatio;

    if (previousMonthCount === 0) {
        employeeRatio = totalEmployees > 0 ? 100 : 0;
    } else if (totalEmployees === previousMonthCount) {
        employeeRatio = 0;
    } else {
        employeeRatio =
            ((totalEmployees - previousMonthCount) / previousMonthCount) * 100;
    }

    // Restrict the ratio between -100 and 100
    employeeRatio = Math.max(-100, Math.min(100, employeeRatio));

    return {
        count: totalEmployees,
        ratio: employeeRatio,
    };
}

async function totalNewEmployeeRatio(startDate, endDate, companyId) {
    /* const employeeCount = await Employee.aggregate([
        {
            $match: {
                companyId: { $eq: objectId(companyId) },
                status: { $eq: 0 },
            },
        },
        {
            $facet: {
                currentMonth: [
                    {
                        $match: {
                            onboardingDate: {
                                $gte: startDate,
                                $lt: endDate,
                            },
                        },
                    },
                    { $count: "count" },
                ],
                previousMonth: [
                    {
                        $match: {
                            onboardingDate: {
                                $lt: startDate,
                            },
                        },
                    },
                    { $count: "count" },
                ],
            },
        },
    ]);

    const currentMonthCount = employeeCount[0].currentMonth[0]?.count || 0;
    const previousMonthCount = employeeCount[0].previousMonth[0]?.count || 0;

    const totalEmployees = previousMonthCount + currentMonthCount;

    let employeeRatio;

    if (previousMonthCount === 0) {
        employeeRatio = totalEmployees > 0 ? 100 : 0;
    } else if (totalEmployees === previousMonthCount) {
        employeeRatio = 0;
    } else {
        employeeRatio =
            ((totalEmployees - previousMonthCount) / previousMonthCount) * 100;
    }

    // Restrict the ratio between -100 and 100
    employeeRatio = Math.max(-100, Math.min(100, employeeRatio)); */

    return {
        count: 0,
        ratio: 0,
    };
}
