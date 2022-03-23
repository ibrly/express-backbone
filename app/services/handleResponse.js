export const handleResponse = async (
	res,
	status,
	json
) => {
	res.status(status)
	   .json(await json)
}
