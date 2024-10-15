import mongoose from "mongoose";
import {
    format,
    eachDayOfInterval,
    parse,
    differenceInMinutes,
} from "date-fns";

export const calculateWorkedTimeAndOvertime = (
    checkInTime,
    checkOutTime,
    inputHours = "8:00"
) => {
    // Parse the check-in and check-out times
    const checkIn = parse(checkInTime, "HH:mm", new Date());
    const checkOut = parse(checkOutTime, "HH:mm", new Date());

    if (checkOut < checkIn) {
        checkOut.setDate(checkOut.getDate() + 1);
    }

    // Calculate the total worked minutes
    const workedMinutes = differenceInMinutes(checkOut, checkIn);
    const workedHours = Math.floor(workedMinutes / 60);
    const remainingMinutes = workedMinutes % 60;

    // Calculate the standard minutes and overtime minutes
    const [standardHours, standardMinutes] = inputHours.split(":").map(Number);

    const totalStandardMinutes = standardHours * 60 + standardMinutes;

    const overtimeMinutes =
        workedMinutes > totalStandardMinutes
            ? workedMinutes - totalStandardMinutes
            : 0;

    //const overtimeHours = Math.floor(overtimeMinutes / 60);
    //const overtimeRemainingMinutes = overtimeMinutes % 60;

    return {
        workedHours,
        workedMinutes: remainingMinutes,
        overtimeMinutes,
    };
};

export const calculateLateTime = (startTime, checkIn) => {
    const start = parse(startTime, "hh:mm a", new Date());
    const newStart = parse(format(start, "HH:mm"), "HH:mm", new Date());
    const checkInTime = parse(checkIn, "HH:mm", new Date());

    const difference = differenceInMinutes(checkInTime, newStart);

    return difference > 0 ? difference : 0;
};

export const getAllDatesInMonthFromInput = (inputDate) => {
    const date = new Date(inputDate);
    const inputYear = date.getFullYear();
    const inputMonth = date.getMonth();

    // Get the total number of days in the input month
    const daysInMonth = new Date(inputYear, inputMonth + 1, 0).getDate();

    // Full day names array
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Create an array of all full dates in the input month
    const allDatesArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(inputYear, inputMonth, day);
        const formattedDate = currentDate.toISOString();
        const dayName = dayNames[currentDate.getDay()];
        allDatesArray.push({
            date: formattedDate,
            dayName: dayName,
            dayNumber: currentDate.getDate(),
        });
    }

    return allDatesArray;
};

export const getDateArray = (startDate, endDate) => {
    // Get an array of all dates between startDate and endDate
    const dateArray = eachDayOfInterval({ start: startDate, end: endDate });

    // Format the dates as strings (optional) for easier readability
    const formattedDateArray = dateArray.map((date) =>
        format(date, "yyyy-MM-dd")
    );

    return formattedDateArray;
};

export const generateCode = (length) => {
    const characters = "0123456789";
    let otp = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
    }

    return otp;
};

export const dateFormat = (inputDate, inputformat = "yyyy-MM-dd") => {
    const timestamp = new Date(inputDate);
    return format(timestamp, inputformat);
};

export const objectId = (id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    }

    return id;
};

export const getSegments = (str) => {
    if (!str) return str;
    return str.split("/").filter((segment) => segment.length > 0);
};

export const ucfirst = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const ucwords = (str) => {
    if (!str) return str;
    return str
        .split(" ")
        .map((word) => ucfirst(word))
        .join(" ");
};

export const strSlud = (str) => {
    if (!str) return str;
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "-")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
};
