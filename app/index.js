import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'

import {sequelize}  from './util/database.js'
import UploadConfig from "./util/UploadConfig.js";
import router       from "./routes.js";
import {logger}     from "./util/logging.js";
import chatRoutes   from './api/message/routes/chat.js'
import {createChatSocket} from "./util/socket.js";
import {createServer}  from "http";
const app = express();

const socketServer = createServer();
createChatSocket(socketServer);
socketServer.listen(process.env.SOCKET_PORT || 3011);

app.use(express.json());
app.use(cors());
app.use(UploadConfig.uploadImage);
try {
	await sequelize.sync({logging: false})
	app.listen(process.env.PORT)
} catch (e) {
	console.log(e)
}
app.use(
	'/',
	router
)
app.use((
			error,
			req,
			res,
			next
		) => {
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status)
	   .json({
				 message: message,
				 data   : data
			 });
});

