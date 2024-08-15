import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { ApiError } from "../utilities/ApiError.js"

import { Team } from "../models/teamModel.js"


export const storeData = asyncHandler(async (req, res) => {

    const formData = req.body

    if (!formData.name) {
        throw new ApiError(400, "Company name is required")
    }

    const data = {
        companyId: req.user.companyId,
        name: formData.name
    }

    if (formData.teamHead) {
        data.teamHead = formData.teamHead
    }

    if (formData.employes) {
        data.employes = formData.employes
    }

    const company = Team.create(data)

    console.log(company)

    return res.status(201).json(new ApiResponse(200, company, "Team create successful."))
})






export const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is mission")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res.status(2000)
        .json(new ApiResponse(200, user, "Avatar update successfully"))
})