// The chat socket needs no database, so it runs on a throwaway HTTP server.
import test        from 'node:test'
import assert      from 'node:assert/strict'
import {once}      from 'node:events'
import {createServer} from 'node:http'
import jwt         from 'jsonwebtoken'
import {io as connect} from 'socket.io-client'

process.env.JWT_PRIVATE_KEY = 'test-key'
const {createChatSocket} = await import('../util/socket.js')

let httpServer
let chat
let url
const clients = []

test.before(async () => {
	httpServer = createServer()
	chat = createChatSocket(httpServer)
	httpServer.listen(0)
	await once(httpServer, 'listening')
	url = `http://127.0.0.1:${httpServer.address().port}`
})

test.after(() => {
	clients.forEach(client => client.close())
	chat.close()
})

const client = (token) => {
	const socket = connect(url, {auth: token === undefined ? {} : {token}, reconnection: false, transports: ['websocket']})
	clients.push(socket)
	return socket
}
const sign = (options) => jwt.sign({userId: 1}, 'test-key', options)

for (const [name, token] of [
	['no token', undefined],
	['a malformed token', 'nope'],
	['a token signed with another key', jwt.sign({userId: 1}, 'other-key')],
	['an expired token', sign({expiresIn: -10})],
]) {
	test(`a client with ${name} is refused`, async () => {
		const [error] = await once(client(token), 'connect_error')
		assert.equal(error.message, 'Not authenticated')
	})
}

test('authenticated clients get refreshChat when another one sends a message', async () => {
	const sender = client(sign())
	const receiver = client(sign())
	await Promise.all([once(sender, 'connect'), once(receiver, 'connect')])

	const refreshed = once(receiver, 'refreshChat')
	sender.emit('chatMessage')
	await refreshed
})
