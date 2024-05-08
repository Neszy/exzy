
module.exports = (req, res, next) => {
    res.success = (data = '', statusCode = 200) => {
        res.status(statusCode || 200).send(data)
    }

    res.error = ({ code, data, message }) => {
        let errorBody = { code, data, message }
        if (code) errorBody.code = code
        res.status(code || 500).send(errorBody)
    }

    next()
}