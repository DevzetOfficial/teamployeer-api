import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { User } from "../models/userModel.js";
import { Usertoken } from "../models/usertokenModel.js";
import { Company } from "../models/companyModel.js";
import sendMail from "../utilities/mailer.js";
import { generateCode } from "../utilities/helper.js";
import jwt from "jsonwebtoken";

// send otp email
export const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const tokenExists = await Usertoken.findOne({ email: email });
    if (tokenExists) {
        await Usertoken.deleteMany({ email: email });
    }

    const otpCode = generateCode(6);

    try {
        await sendMail(
            email,
            "Your One-Time (OTP) for Teamployeer",
            {
                otp: otpCode,
                email: email,
            },
            "sendOtp"
        );

        // store user token
        await Usertoken.create({ email: email, token: otpCode });

        return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "The OTP has been sent to your email address."
                )
            );
    } catch (error) {
        throw new ApiError(500, "Error sending email: " + error.message);
    }
});

// verify otp email
export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    if (!otp) {
        throw new ApiError(400, "OTP is required");
    }

    const tokenVerify = await Usertoken.findOne({ email: email, token: otp });
    if (!tokenVerify) {
        throw new ApiError(400, "Invalid OTP");
    }

    const currentTime = new Date();
    if (currentTime > tokenVerify.expireAt) {
        throw new ApiError(400, "OTP is expired");
    }

    const userInfo = await User.findOne({ email });
    const isLogin = userInfo ? true : false;

    return res
        .status(201)
        .json(
            new ApiResponse(200, { isLogin: isLogin }, "OTP verify successful")
        );
});

export const login = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    if (!otp) {
        throw new ApiError(400, "OTP is required");
    }

    const tokenVerify = await Usertoken.findOne({ email: email, token: otp });
    if (!tokenVerify) {
        throw new ApiError(400, "Invalid credentials");
    }

    const currentTime = new Date();
    if (tokenVerify.length > 0 && currentTime > tokenVerify.expireAt) {
        throw new ApiError(400, "OTP is expired");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        throw new ApiError(
            404,
            "The specified user does not exist in our records"
        );
    }

    // delete user token
    await Usertoken.findByIdAndDelete(tokenVerify._id);

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    // get login user info
    const loggedInUser = await User.findById(user._id).select(
        "-googleId -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToekn", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

export const register = asyncHandler(async (req, res) => {
    const { otp, email, fullName, companyName, companyType, companySize } =
        req.body;

    if (!otp) {
        throw new ApiError(400, "OTP is required");
    }

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const company = await Company.create({
        companyName: companyName,
        companyType: companyType,
        companySize: companySize,
        email: email,
        mobile: "",
        address: "",
        startTime: "",
        endTime: "",
        logo: "",
    });

    const companyInfo = await Company.findById(company._id).select("-__v");

    if (!companyInfo) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user!"
        );
    }

    const user = await User.create({
        companyId: company._id,
        fullName: fullName,
        email: email,
        avatar: "",
        userType: "owner",
        googleId: "",
        isActive: true,
        refreshToken: "",
    });

    const userInfo = await User.findById(user._id).select(
        "-googleId -refreshToken"
    );

    if (!userInfo) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user!"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { companyInfo, userInfo },
                "User registered successful."
            )
        );
});

export const googleLogin = asyncHandler(async (req, res) => {
    const { email, googleId } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    if (!googleId) {
        throw new ApiError(400, "Google Id is required");
    }

    const user = await User.findOne({ email: email, googleId: googleId });

    if (!user) {
        throw new ApiError(404, "User does not exists");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-googleId -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToekn", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

export const googleRegister = asyncHandler(async (req, res) => {
    const { googleId, email, fullName, companyName, companyType, companySize } =
        req.body;

    if (!googleId) {
        throw new ApiError(400, "Google id is required");
    }

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const company = await Company.create({
        companyName: companyName,
        companyType: companyType,
        companySize: companySize,
        email: email,
        mobile: "",
        address: "",
        startTime: "",
        endTime: "",
        logo: "",
    });

    const companyInfo = await Company.findById(company._id).select("-__v");

    if (!companyInfo) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user!"
        );
    }

    const user = await User.create({
        companyId: company._id,
        fullName: fullName,
        email: email,
        avatar: "",
        userType: "owner",
        googleId: googleId,
        isActive: true,
        refreshToken: "",
    });

    const userInfo = await User.findById(user._id).select(
        "-googleId -refreshToken"
    );

    if (!userInfo) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user!"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { companyInfo, userInfo },
                "User registered successful."
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Expire refresh token");
        }

        const options = {
            httpOnly: true,
            //secure: process.env.NODE_ENV === "production",
            //sameSite: "Lax",
        };

        const { newAccessToken, newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refresh successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token!");
    }
});

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBaforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Somethis went wrong while generating access and refresh token!"
        );
    }
};

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fatched successfully"));
});
