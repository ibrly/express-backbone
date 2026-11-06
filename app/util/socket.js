import {Server} from "socket.io";
import jwt      from "jsonwebtoken";

// Chat clients connect here and get a refresh event when someone sends a message.
export const createChatSocket = (httpServer) => {
	const io = new Server(httpServer,
		{
			cors: {
				origin : process.env.FRONT_END_URL || "http://localhost:3000",
				methods: [
					"GET",
					"POST"
				]
			}
		});
	// Same JWT as the REST API, sent by the client as io(url, {auth: {token}}).
	io.use((socket, next) => {
		try {
			socket.data.userId = jwt.verify(socket.handshake.auth.token, process.env.JWT_PRIVATE_KEY).userId;
			next();
		} catch {
			next(new Error('Not authenticated'));
		}
	});
	io.on('connection',
		(socket) => {
			socket.on('chatMessage',
				() => {
					socket.broadcast.emit('refreshChat')
				});
		});
	return io;
}
