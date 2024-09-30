import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { format, differenceInDays } from "date-fns";
import { objectId, getSegments, ucfirst } from "../utilities/helper.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utilities/cloudinary.js";

import { Timeoff } from "../models/timeoffModel.js";
import { TimeoffAttachment } from "../models/timeoffAttachmentModel.js";

export const createData = asyncHandler(async (req, res) => {
    const totalDay = differenceInDays(
        new Date(req.body.endDate),
        new Date(req.body.startDate)
    );

    const data = req.body;
    data.companyId = req.user?.companyId;
    data.totalDay = totalDay + 1;
    data.attachments = [];

    const newTimeoff = await Timeoff.create(data);

    if (!newTimeoff) {
        throw new ApiError(400, "Invalid credentials");
    }

    if (req.files.length > 0) {
        const attachmentData = await Promise.all(
            req.files.map(async (file) => {
                const uploadAvatar = await uploadOnCloudinary(file.path);

                const attachmentData = {
                    timeoffId: newTimeoff._id,
                    name: file.originalname,
                    attachment: uploadAvatar?.url || "",
                };

                return attachmentData;
            })
        );

        const attachmentCreate = await TimeoffAttachment.create(attachmentData);

        // update time off attachment
        if (attachmentCreate) {
            const timeoff = await Timeoff.findById(newTimeoff._id);

            attachmentCreate.forEach((row) => {
                timeoff.attachments.push(row._id);
            });

            await timeoff.save();
        }
    }

    const newTimeOff = await Timeoff.findById(newTimeoff._id).populate(
        "attachments"
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { newTimeOff },
                "Time Off created successfully"
            )
        );
});

export const getAllData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId };

    const segments = getSegments(req.url);

    if (segments?.[1]) {
        filters.status = ucfirst(segments[1]);
    }

    const timeOffs = await Timeoff.find(filters).lean();

    const pendingList = timeOffs.filter((row) => row.status === "Pending");

    const timeOffDataList = timeOffs.map((timeoff) => {
        const clasheData = pendingList.filter(
            (pRow) =>
                format(pRow.startDate, "yyyy-MM-dd") ===
                    format(timeoff.startDate, "yyyy-MM-dd") &&
                pRow.employee._id !== timeoff.employee._id
        );

        return {
            ...timeoff.toObject(),
            clashes: clasheData ? clasheData : [],
        };
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                timeOffDataList,
                "Time off retrieved successfully"
            )
        );
});

export const getCountData = asyncHandler(async (req, res) => {
    const timeOffs = await Timeoff.aggregate([
        {
            $match: {
                companyId: { $eq: req.user?.companyId },
            },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    let pending = 0;
    let approved = 0;
    let declined = 0;
    let total = 0;

    if (timeOffs) {
        timeOffs.forEach((row) => {
            if (row._id === "Pending") {
                pending = row.count;
            }

            if (row._id === "Approved") {
                approved = row.count;
            }

            if (row._id === "Declined") {
                declined = row.count;
            }

            total += row.count;
        });
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { pending, approved, declined, total },
                "Time off retrieved successfully"
            )
        );
});

export const getData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const timeOff = await Timeoff.findOne(filters).populate("attachments");

    if (!timeOff) {
        throw new ApiError(400, "Time Off not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, timeOff, "Time Off retrieved successfully"));
});

export const updateData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const timeOffInfo = await Timeoff.findOne(filters);

    if (!timeOffInfo) {
        throw new ApiError(400, "Time off not found");
    }

    const data = req.body;
    data.attachments = timeOffInfo.attachments;

    if (req.body.startDate && req.body.endDate) {
        const totalDay = differenceInDays(
            new Date(req.body.endDate),
            new Date(req.body.startDate)
        );

        data.totalDay = totalDay + 1;
    }

    await Timeoff.findByIdAndUpdate(timeOffInfo._id, data, { new: true });

    if (typeof req.files !== "undefined" && req.files.length > 0) {
        const attachmentData = await Promise.all(
            req.files.map(async (file) => {
                const uploadAvatar = await uploadOnCloudinary(file.path);

                const attachmentData = {
                    timeoffId: timeOffInfo._id,
                    name: file.originalname,
                    attachment: uploadAvatar?.url || "",
                };

                return attachmentData;
            })
        );

        const attachmentCreate = await TimeoffAttachment.create(attachmentData);

        // update time off attachment
        if (attachmentCreate.length > 0) {
            const timeOff = await Timeoff.findById(timeOffInfo._id);

            attachmentCreate.forEach((row) => {
                timeOff.attachments.push(row._id);
            });

            await timeOff.save();
        }
    }

    const updtaeTimeOff = await Timeoff.findById(timeOffInfo._id).populate(
        "attachments"
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updtaeTimeOff, "Time Off updated successfully")
        );
});

export const deleteData = asyncHandler(async (req, res) => {
    const filters = { companyId: req.user?.companyId, _id: req.params.id };

    const timeOffInfo = await Timeoff.findOne(filters);

    if (!timeOffInfo) {
        throw new ApiError(404, "Time Off not found");
    }

    const timeOffDocument = await TimeoffAttachment.find({
        timeoffId: timeOffInfo._id,
    });

    if (timeOffDocument.length > 0) {
        await Promise.all(
            timeOffDocument.map(async (row) => {
                await destroyOnCloudinary(row.attachment);
            })
        );

        await TimeoffAttachment.deleteMany({ timeoffId: timeOffInfo._id });
    }

    await Timeoff.findByIdAndDelete(timeOffInfo._id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Time Off delete successfully"));
});

export const deleteAttachment = asyncHandler(async (req, res) => {
    const { timeoffId, id } = req.params;

    const filters = { companyId: req.user?.companyId, _id: timeoffId };

    const timeOffInfo = await Timeoff.findOne(filters);

    if (!timeOffInfo) {
        throw new ApiError(404, "Time Off not found");
    }

    if (timeOffInfo.attachments.includes(id)) {
        // Remove the attachment by id
        timeOffInfo.attachments.pull(id);

        // Save the updated document
        await timeOffInfo.save();
    }

    const attachmentFilters = { timeoffId: timeoffId, _id: id };

    const attachmentInfo = await TimeoffAttachment.findOne(attachmentFilters);

    if (!attachmentInfo) {
        throw new ApiError(404, "Attachment not found");
    }

    await destroyOnCloudinary(attachmentInfo.attachment);

    await TimeoffAttachment.findByIdAndDelete(id);

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Time Off attachment delete successfully")
        );
});
