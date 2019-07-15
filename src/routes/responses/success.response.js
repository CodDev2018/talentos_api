module.exports = (res, httpStatus, message, data) => {
    return res.status(httpStatus).json({
        status: 'SUCCESS',
        message: message,
        data: data
    })
}