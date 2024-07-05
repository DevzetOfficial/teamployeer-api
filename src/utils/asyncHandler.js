const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Profise.resolve(requestHandler(req, res, next)).
        catch((err) => next(err))
        
    };
}


export {asyncHandler}


/*
const asyncHandler = (fn) => async(red, res, next) => {
    try {

        await fn(req, res, next);

    }catch (err) {
        res.status(err.code || 500).json({
            status: false,
            message: err.message
        })
    }
}
*/