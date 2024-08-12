import { asyncHandler } from "../utilities/asyncHandler.js"
import { ApiResponse } from "../utilities/ApiResponse.js"
import { Country } from "../models/countryModel.js"

const countryList = asyncHandler(async (req, res) => {

    const countrys = await Country.find()

    return res.status(201).json(new ApiResponse(200, countrys, "Country add successful."))
})


export { countryList }


