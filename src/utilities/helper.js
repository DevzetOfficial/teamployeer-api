import mongoose from "mongoose";

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

export const objectId = (id) => {
    if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
    }
}

export const getSegment = (str) => {
  
    if (!str) return str
    return str.split('/').filter(segment => segment.length > 0)
};

export const ucfirst = (str) => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
};

export const ucwords = (str) => {
    if (!str) return str
    return str.split(' ').map(word => ucfirst(word)).join(' ')
};

export const strSlud = (str) => {
    if (!str) return str
    return str
      .toLowerCase()                      
      .trim()                             
      .replace(/[^a-z0-9\s-]/g, '-')       
      .replace(/\s+/g, '-')               
      .replace(/--+/g, '-')               
      .replace(/^-+|-+$/g, '');           
  }