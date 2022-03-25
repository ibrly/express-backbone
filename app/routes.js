import express         from "express";
import {
	dirname,
	join
}                      from "path";
import authRoutes      from "./api/user/routes/auth/auth.js";
import chatRoutes      from "./api/message/routes/chat.js";
import {fileURLToPath} from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

router.use(
	'/images',
	express.static(join(
		__dirname,
		'images'
	))
);

router.use(
	'/auth',
	authRoutes
);
router.use(
	'/message',
	chatRoutes
)
export default router
