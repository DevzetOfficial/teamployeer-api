import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"
import { generateCode, objectId } from "../utilities/helper.js"
import { uploadOnCloudinary, destroyOnCloudinary } from "../utilities/cloudinary.js"


import { TimeOff } from "../models/timeOffModel.js"

export const createData = asyncHandler(async (req, res) => {

    const formData = req.body;

    
    let uploadAvatar
    if (req.file?.path) {
        uploadAvatar = await uploadOnCloudinary(req.file?.path)
    }

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const data = {
        companyId: companyId,
        TimeOffId: generateCode(7),
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        country: formData.country,
        source: formData.source,
        sourceLink: formData.sourceLink,
        avatar: uploadAvatar?.url || "",
        note: formData.note,
    }

    const newTimeOff = await TimeOff.create(data);

    if (!newTimeOff) {
        throw new ApiError(400, "Invalid credentials.")
    }

    return res.status(201).json(new ApiResponse(201, newTimeOff, "TimeOff created successfully."));
})

export const getActiveData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, status: 1 }

    const TimeOffs = await TimeOff.find(filters).select("-__v")

    return res.status(201).json(new ApiResponse(200, TimeOffs, "TimeOff retrieved successfully."))
})


export const getInactiveData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, status: 0 }

    const TimeOffs = await TimeOff.find(filters).select("-__v")

    return res.status(201).json(new ApiResponse(200, TimeOffs, "TimeOff retrieved successfully."))
})

export const getCountData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac";

    const TimeOffs = await TimeOff.aggregate([
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

    let active = 0 
    let inactive = 0

    if (TimeOffs) {
        TimeOffs.forEach(row => {

            if (row._id === 1) {
                active = row.count
            }

            if (row._id === 0) {
                inactive = row.count
            }
        })
    }

    return res.status(201).json(new ApiResponse(200, { active, inactive }, "TimeOff retrieved successfully."))
})

export const getData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, _id: req.params.id }

    const TimeOff = await TimeOff.findOne(filters).select("-__v");

    if (!TimeOff) {
        throw new ApiError(400, "TimeOff not found")
    }

    return res.status(200).json(new ApiResponse(200, TimeOff, "TimeOff retrieved successfully"));
})

export const updateData = asyncHandler(async (req, res) => {

    const companyId = req.user?.companyId || "66bdec36e1877685a60200ac"

    const filters = { companyId: companyId, _id: req.params.id }

    const TimeOffInfo = await TimeOff.findOne(filters)

    if (!TimeOffInfo) {
        throw new ApiError(400, "TimeOff not found")
    }

    const data = req.body;

    if (req.file && req.file?.path) {
        const uploadAvatar = await uploadOnCloudinary(req.file?.path)
        data.avatar = uploadAvatar?.url || ""

        if (TimeOffInfo && TimeOffInfo.avatar) {
            await destroyOnCloudinary(TimeOffInfo.avatar);
        }
    }

    const TimeOff = await TimeOff.findByIdAndUpdate(
        TimeOffInfo._id,
        data,
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, TimeOff, "TimeOff updated successfully."));
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

