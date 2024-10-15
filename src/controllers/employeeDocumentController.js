import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
    uploadOnCloudinary,
    destroyOnCloudinary,
} from "../utils/cloudinary.js";

import { EmployeeDocument } from "../models/employeeDocumentModel.js";

export const documentCreate = asyncHandler(async (req, res) => {
    if (!req.params?.employeeId) {
        throw new ApiError(400, "Employee id is required");
    }

    const data = req.body;
    data.companyId = req.user?.companyId;
    data.employeeId = req.params?.employeeId;

    data.submitted = Date.now();
    data.approved = "";

    if (!req.file?.path) {
        throw new ApiError(400, "Attachment is required");
    }

    const attachmentPath = await uploadOnCloudinary(req.file?.path);

    data.fileName = req.file?.originalname || "";
    data.attachment = attachmentPath?.url || "";

    const newDocument = await EmployeeDocument.create(data);

    if (!newDocument) {
        throw new ApiError(400, "Invalid credentials");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                newDocument,
                "Employee document add successfully"
            )
        );
});

export const getAllDocument = asyncHandler(async (req, res) => {
    const filters = {
        companyId: req.user?.companyId,
        employeeId: req.params.employeeId,
    };

    const documents = await EmployeeDocument.find(filters);

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                documents,
                "Employee documents retrieved successfully"
            )
        );
});

export const updateDocument = asyncHandler(async (req, res) => {
    const { employeeId, id } = req.params;

    if (!employeeId) {
        throw new ApiError(400, "Employee id is required");
    }

    if (!id) {
        throw new ApiError(400, "Document id is required");
    }

    const filters = {
        companyId: req.user?.companyId,
        employeeId: employeeId,
        _id: id,
    };

    const documentInfo = await EmployeeDocument.findOne(filters);

    if (!documentInfo) {
        throw new ApiError(404, "Employee document not found");
    }

    const data = {};

    if (!req.body?.status) {
        throw new ApiError(400, "Status is required");
    }

    data.status = req.body.status;

    if (req.body.status == "Approved") {
        data.approved = Date.now();
    }

    const employeeDocument = await EmployeeDocument.findByIdAndUpdate(
        documentInfo._id,
        data,
        { new: true }
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                employeeDocument,
                "Employee document updated successfully"
            )
        );
});

export const deleteDocument = asyncHandler(async (req, res) => {
    const filters = {
        companyId: req.user?.companyId,
        employeeId: req.params?.employeeId,
        _id: req.params?.id,
    };

    const documentInfo = await EmployeeDocument.findOne(filters);

    if (!documentInfo) {
        throw new ApiError(404, "Employee document not found");
    }

    if (documentInfo.attachment) {
        await destroyOnCloudinary(documentInfo.attachment);
    }

    await EmployeeDocument.findByIdAndDelete(documentInfo._id);

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "Employee docemnt delete successfully"));
});
