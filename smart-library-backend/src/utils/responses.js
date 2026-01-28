const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const errorResponse = (res,message, statusCode = 400, error) => {
    res.status(statusCode).json({
        success: false,
        message,
        error
    });
};

module.exports = {
    successResponse,
    errorResponse
};