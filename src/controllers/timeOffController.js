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

    const timeOffs = await TimeOff.find(filters)

    const pendingList = timeOffs.filter(row => row.status === "Pending");
    
    timeOffs.forEach(row => {
        const clasheData = pendingList.filter(pRow => pRow.startDate === row.startDate && pRow.employee._id != row.employee._id);
        console.log(clasheData,  row.employee._id)
        
        row.clashes.push(clasheData.length > 0 ? clasheData : [])

        console.log(row.clashes)
    });

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
        throw new ApiError(400, "Time off not found")
    }

    const data = req.body;
    data.attachments = timeOffInfo.attachments;

    await TimeOff.findByIdAndUpdate(
        timeOffInfo._id,
        data,
        { new: true }
    );


    if(typeof req.files !== "undefined" && req.files.length > 0){

        const attachmentData = await Promise.all(
            req.files.map(async (file) => {

                const uploadAvatar = await uploadOnCloudinary(file.path);

                const attachmentData = {
                    timeoffId: timeOffInfo._id,
                    name: file.originalname,
                    attachment: uploadAvatar?.url || ''
                }

                return attachmentData;
            })
        )

        const attachmentCreate = await TimeOffAttachment.create(attachmentData)

        // update time off attachment
        if(attachmentCreate.length > 0){

            const timeOff = await TimeOff.findById(timeOffInfo._id)

            attachmentCreate.forEach(row => {
                timeOff.attachments.push(row._id);
            })

            await timeOff.save();
        }
    }

    const updtaeTimeOff = await TimeOff.findById(timeOffInfo._id).populate("attachments")

    return res.status(200).json(new ApiResponse(200, updtaeTimeOff, "Time Off updated successfully."));
})

export const deleteData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"
    const filters = { companyId: companyId, _id: req.params.id }

    const timeOffInfo = await TimeOff.findOne(filters)
   
    if (!timeOffInfo) {
        throw new ApiError(404, "Time Off not found!")
    }

    const timeOffDocument = await TimeOffAttachment.find({ timeoffId: timeOffInfo._id })

    if(timeOffDocument.length > 0){
        await Promise.all(
            timeOffDocument.map(async (row) => {
                await destroyOnCloudinary(row.attachment)
            })
        )

        await TimeOffAttachment.deleteMany({ timeoffId: timeOffInfo._id })
    }

    await TimeOff.findByIdAndDelete(timeOffInfo._id)


    return res.status(200).json(new ApiResponse(200, {}, "Time Off delete successfully."));
})


export const deleteAttachment = asyncHandler(async (req, res) => {

    const {timeoffId, id} = req.params

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"
    const filters = { companyId: companyId, _id: timeoffId }

    const timeOffInfo = await TimeOff.findOne(filters)
   
    if (!timeOffInfo) {
        throw new ApiError(404, "Time Off not found!")
    }

    if (timeOffInfo.attachments.includes(id)) {

        // Remove the attachment by id
        timeOffInfo.attachments.pull(id)

        // Save the updated document
        await timeOffInfo.save()
    }


    const attachmentFilters = { timeoffId: timeoffId, _id: id }

    const attachmentInfo = await TimeOffAttachment.findOne(attachmentFilters)
   
    if (!attachmentInfo) {
        throw new ApiError(404, "Attachment not found!")
    }

    await destroyOnCloudinary(attachmentInfo.attachment)

    await TimeOffAttachment.findByIdAndDelete(id)

    return res.status(200).json(new ApiResponse(200, {}, "Time Off attachment delete successfully."));
})

