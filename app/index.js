import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import bodyParser from "body-parser";
import multer     from 'multer'

import {sequelize}  from './util/database.js'
import UploadConfig from "./util/UploadConfig.js";
import router       from "./routes.js";
import {logger}     from "./util/logging.js";
import chatRoutes   from './api/message/routes/chat.js'
/*import {Server}        from "socket.io";
 import {createServer}  from "http";*/
const app = express();
/*
 const server     = createServer(app);
 const io         = new Server(server,
 {
 cors: {
 origin : "http://localhost:3000",
 methods: [
 "GET",
 "POST"
 ]
 }
 });
 // logger.error(new Error('sss'))
 io.on('connection',
 (socket) => {
 console.log('connected')
 socket.on('chatMessage',
 () => {
 console.log('ssss')
 socket.broadcast.emit('refreshChat')
 });
 });
 
 server.listen(3011);
 */

app.use(bodyParser.json());
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

