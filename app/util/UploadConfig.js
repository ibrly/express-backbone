import multer from "multer";
import {v4}   from "uuid";

export default class UploadConfig {
	static fileStorage = multer.diskStorage({
												destination: (
													req,
													file,
													cb
												) => {
													cb(
														null,
														'images'
													);
												},
												filename   : (
													req,
													file,
													cb
												) => {
													cb(
														null,
														v4() + file.originalname
													)
												}
											});
	static fileFilter = (
		req,
		file,
		cb
	) => {
		if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
			cb(
				null,
				true
			);
		} else {
			cb(
				null,
				false
			);
		}
	};
}
