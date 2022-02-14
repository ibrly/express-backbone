export const handleResponse = (res,
                               status,
                               json) => {
    res.status(status).json(json)
}
