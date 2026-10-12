import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import multer     from 'multer'

import {sequelize}  from './util/database.js'
import UploadConfig from "./util/UploadConfig.js";
import router       from "./routes.js";
import {logger}     from "./util/logging.js";
import chatRoutes   from './api/message/routes/chat.js'
import {Server}        from "socket.io";
import {createServer}  from "http";
const app = express();

// Chat clients connect here and get a refresh event when someone sends a message.
const socketServer = createServer();
const io = new Server(socketServer,
	{
		cors: {
			origin : process.env.FRONT_END_URL || "http://localhost:3000",
			methods: [
				"GET",
				"POST"
			]
		}
	});
io.on('connection',
	(socket) => {
		socket.on('chatMessage',
			() => {
				socket.broadcast.emit('refreshChat')
			});
	});
socketServer.listen(process.env.SOCKET_PORT || 3011);

app.use(express.json());
app.use(cors());
app.use(multer({
				   storage: UploadConfig.fileStorage,
				   filter : UploadConfig.fileFilter
			   })
			.single('image'));
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

