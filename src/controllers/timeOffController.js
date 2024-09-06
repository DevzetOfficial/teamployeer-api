import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"
import { objectId, getSegments, ucfirst } from "../utilities/helper.js"
import { uploadOnCloudinary, destroyOnCloudinary } from "../utilities/cloudinary.js"


import { TimeOff } from "../models/timeOffModel.js"
import { TimeOffAttachment } from "../models/timeOffAttachmentModel.js"

export const createData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const data = req.body

    data.companyId = companyId
    data.attachments = []

    const timeOffCreate = await TimeOff.create(data);

    if (!timeOffCreate) {
        throw new ApiError(400, "Invalid credentials.")
    }


    if(req.files.length > 0){

        const attachmentData = await Promise.all(
            req.files.map(async (file) => {

                const uploadAvatar = await uploadOnCloudinary(file.path);

                const attachmentData = {
                    timeoffId: timeOffCreate._id,
                    name: file.originalname,
                    attachment: uploadAvatar?.url || ''
                }

                return attachmentData;
            })
        );

        const attachmentCreate = await TimeOffAttachment.create(attachmentData)


        // update time off attachment
        if(attachmentCreate){

            const timeOff = await TimeOff.findById(timeOffCreate._id)

            attachmentCreate.forEach(row => {
                timeOff.attachments.push(row._id);
            })

            await timeOff.save();
        }
    }

    const newTimeOff = await TimeOff.findById(timeOffCreate._id).populate("attachments")
    

    return res.status(201).json(new ApiResponse(201, {newTimeOff}, "Time Off created successfully."));
})

export const getAllData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId}

    const segments = getSegments(req.url)

    if(segments?.[1]){
        filters.status = ucfirst(segments[1])
    }

    const timeOffs = await TimeOff.find(filters).select("-__v")

    return res.status(201).json(new ApiResponse(200, timeOffs, "TimeOff retrieved successfully."))
})

export const getCountData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const timeOffs = await TimeOff.aggregate([
        {
            $match: {
                companyId: { $eq: objectId(companyId) }
            }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    let pending = 0 
    let approved = 0 
    let declined = 0
    let total = 0 

    if (timeOffs) {
        timeOffs.forEach(row => {

            if (row._id === "Pending") {
                pending = row.count
            }

            if (row._id === "Approved") {
                approved = row.count
            }

            if (row._id === "Declined") {
                declined = row.count
            }

            total += row.count
        })
    }

    return res.status(201).json(new ApiResponse(200, { pending, approved, declined, total }, "Time Off retrieved successfully."))
})

export const getData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, _id: req.params.id }

    const timeOff = await TimeOff.findOne(filters).populate("attachments")

    if (!timeOff) {
        throw new ApiError(400, "Time Off not found")
    }

    return res.status(200).json(new ApiResponse(200, timeOff, "Time Off retrieved successfully"));
})

export const updateData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, _id: req.params.id }

    const timeOffInfo = await TimeOff.findOne(filters)

    if (!timeOffInfo) {
        throw new ApiError(400, "TimeOff not found")
    }

    const data = req.body;

    const updateTimeOff = await TimeOff.findByIdAndUpdate(
        timeOffInfo._id,
        data,
        { new: true }
    );


    const attachments = await Promise.all(
        req.files.map(async (file) => {

            const uploadAvatar = await uploadOnCloudinary(file.path);

            const attachmentData = {
                timeoffId: timeOffInfo._id,
                name: file.originalname,
                attachment: uploadAvatar?.url || ''
            }

            return attachmentData;
        })
    );

    if(attachments){
        const attachmentCreate = await TimeOffAttachment.create(attachments)
    }

    return res.status(200).json(new ApiResponse(200, updateTimeOff, "TimeOff updated successfully."));
})

export const deleteData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"
    const filters = { _id: req.params.id, companyId: companyId }

    const info = await TimeOff.findOne(filters)

    if (!info) {
        throw new ApiError(404, "TimeOff not found!")
    }

    let TimeOff
    if (info.status === 0) {
        TimeOff = await TimeOff.findByIdAndUpdate(info.id, { status: 1 }, { new: true });
    } else {
        TimeOff = await TimeOff.findByIdAndUpdate(info.id, { status: 0 }, { new: true });
    }

    return res.status(200).json(new ApiResponse(200, TimeOff, "TimeOff delete successfully."));
})

