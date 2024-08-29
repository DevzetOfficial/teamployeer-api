export const generateCode = (length) => {
    const characters = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
    }

    return otp;
}

export const dateFormat = (inputDate) => {

    const timestamp = new Date(inputDate);

    // Extract year and month
    const year = timestamp.getFullYear();
    const month = ('0' + (timestamp.getMonth() + 1)).slice(-2);
    const date = ('0' + (timestamp.getDate() + 1)).slice(-2);

    return year +"-"+ month +"-"+ date
}