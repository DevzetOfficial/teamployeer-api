import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

import { User } from "../models/userModel.js";
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

    const otpCode = generateCode(6);

    const mailData = {
        otp: otpCode,
        email: email,
    };

    try {
        await sendMail(
            email,
            "Your One-Time (OTP) for Teamployeer",
            mailData,
            "sendOtp"
        );

        const otpSecret = {
            otp: otpCode,
            email: email,
            expireTime: Date.now() + 60 * 1000,
        };

        const options = {
            maxAge: 86400000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
        };

        return res
            .status(201)
            .cookie("otpSecret", otpSecret, options)
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

// send otp email
export const verifyOtp = asyncHandler(async (req, res) => {
    console.log(req.cookies);

    if (!req.cookies?.otpSecret) {
        throw new ApiError(400, "Invalid credentials");
    }

    const { email, otp, expireTime } = req.cookies.otpSecret;

    if ([email, otp].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Invalid credentials");
    }

    if (!expireTime || Date.now() > expireTime) {
        throw new ApiError(400, "OTP has expired");
    }

    const { otpCode } = req.body;

    if (!otpCode) {
        throw new ApiError(400, "OTP is required");
    }

    if (otpCode != otp) {
        throw new ApiError(400, "Invalid credentials");
    }

    const userInfo = await User.findOne({ $or: [{ email }] });
    const isLogin = userInfo ? true : false;

    const otpSecret = {
        email: email,
        otp: otp,
        isLogin: isLogin,
    };

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    };

    return res
        .status(201)
        .cookie("otpSecret", otpSecret, options)
        .json(
            new ApiResponse(200, { isLogin: isLogin }, "OTP verify successful")
        );
});

export const loginUser = asyncHandler(async (req, res) => {
    if (!req.cookies.otpSecret) {
        throw new ApiError(400, "Invalid credentials");
    }

    const { email, otp, isLogin } = req.cookies.otpSecret;

    if ([email, otp].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Invalid credentials");
    }

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    if (!isLogin) {
        throw new ApiError(400, "Invalid credentials");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        throw new ApiError(404, "User does not exists");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select("-refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    };

    return res
        .status(200)
        .clearCookie("otpSecret", options)
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

export const googleLoginUser = asyncHandler(async (req, res) => {
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
        .clearCookie("otpSecret", options)
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

export const registerUser = asyncHandler(async (req, res) => {
    if (!req.cookies.otpSecret) {
        throw new ApiError(400, "Invalid credentials");
    }

    const { email, otp, isLogin } = req.cookies.otpSecret;

    if ([email, otp].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Invalid credentials");
    }

    if (isLogin) {
        throw new ApiError(400, "Invalid credentials");
    }

    const formData = req.body;

    const company = await Company.create({
        companyName: formData.companyName,
        companyType: formData.companyType,
        companySize: formData.companySize,
        email: formData.email,
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
        fullName: formData.fullName,
        email: formData.email,
        avatar: "",
        userType: "owner",
        googleId: "",
        isActive: true,
        refreshToken: "",
    });

    const userInfo = await User.findById(user._id).select("-__v -refreshToken");

    if (!userInfo) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user!"
        );
    }

    const otpSecret = {
        email: email,
        otp: otp,
        isLogin: true,
    };

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    };

    return res
        .status(201)
        .cookie("otpSecret", otpSecret, options)
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
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
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
