// /auth/me goes through isAuth, which rejects bad tokens before any query, so no database is needed.
import test   from 'node:test'
import assert from 'node:assert/strict'
import jwt    from 'jsonwebtoken'

process.env.JWT_PRIVATE_KEY = 'test-key'
process.env.DATABASE_DIALECT ??= 'mysql'
const {default: express}    = await import('express')
const {default: authRoutes} = await import('../api/user/routes/auth/auth.js')

let server
let url

test.before(async () => {
	const app = express()
	app.use('/auth', authRoutes)
	app.use((error, req, res, next) => res.status(error.statusCode || 500).json({message: error.message}))
	server = app.listen(0)
	await new Promise(resolve => server.once('listening', resolve))
	url = `http://127.0.0.1:${server.address().port}/auth/me`
})

test.after(() => server.close())

const me = authorization => fetch(url, {headers: authorization ? {Authorization: authorization} : {}})

test('a missing token gets 401', async () => {
	assert.equal((await me()).status, 401)
})

test('malformed, wrongly signed and expired tokens get 401, not 500', async () => {
	const wrongKey = jwt.sign({userId: '1'}, 'another-key')
	const expired = jwt.sign({userId: '1', exp: Math.floor(Date.now() / 1000) - 60}, 'test-key')
	for (const [label, header] of [['malformed', 'Bearer not-a-jwt'], ['wrong key', `Bearer ${wrongKey}`], ['expired', `Bearer ${expired}`], ['no bearer part', 'Bearer']]) {
		const res = await me(header)
		assert.equal(res.status, 401, label)
		assert.equal((await res.json()).message, 'Not authenticated', label)
	}
})
