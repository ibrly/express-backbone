import {Server} from "socket.io";

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
	io.on('connection',
		(socket) => {
			socket.on('chatMessage',
				() => {
					socket.broadcast.emit('refreshChat')
				});
		});
	return io;
}
