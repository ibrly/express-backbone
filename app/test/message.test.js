// Mounts the real chat router with the app's error handler. The 401 and 400 paths
// return before any query, so no database is needed (Sequelize only connects on first query).
import test   from 'node:test'
import assert from 'node:assert/strict'
import jwt    from 'jsonwebtoken'

process.env.JWT_PRIVATE_KEY = 'test-key'
process.env.DATABASE_DIALECT ??= 'mysql'
const {default: express}    = await import('express')
const {default: chatRoutes} = await import('../api/message/routes/chat.js')

let server
let url

test.before(async () => {
	const app = express()
	app.use(express.json())
	app.use('/message', chatRoutes)
	app.use((error, req, res, next) => res.status(error.statusCode || 500).json({message: error.message}))
	server = app.listen(0)
	await new Promise(resolve => server.once('listening', resolve))
	url = `http://127.0.0.1:${server.address().port}/message`
})

test.after(() => server.close())

const token = jwt.sign({email: 'bob@example.com', userId: '2'}, 'test-key')
const post = (body, headers = {}) => fetch(url, {
	method : 'POST',
	headers: {'content-type': 'application/json', ...headers},
	body   : JSON.stringify(body)
})

test('POST and GET /message without a token are rejected with 401', async () => {
	assert.equal((await post({message: 'hi'})).status, 401)
	assert.equal((await fetch(url)).status, 401)
})

test('an empty or missing message gets a 400 instead of crashing the server', async () => {
	for (const body of [{}, {message: ''}, {message: '   '}, {message: 42}]) {
		const res = await post(body, {Authorization: `Bearer ${token}`})
		assert.equal(res.status, 400, JSON.stringify(body))
		assert.equal((await res.json()).message, 'message is required')
	}
})
