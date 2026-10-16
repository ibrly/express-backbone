// Exercises the real upload middleware in a temp directory: no database needed.
import test             from 'node:test'
import assert           from 'node:assert/strict'
import {mkdtempSync, mkdirSync, readdirSync, rmSync} from 'node:fs'
import {tmpdir}         from 'node:os'
import {join}           from 'node:path'
import express          from 'express'
import UploadConfig     from '../util/UploadConfig.js'

const dir = mkdtempSync(join(tmpdir(), 'upload-test-'))
const cwd = process.cwd()
let server
let url

test.before(async () => {
	process.chdir(dir) // diskStorage writes to ./images
	mkdirSync('images')
	const app = express()
	app.post('/upload', UploadConfig.uploadImage, (req, res) => res.json({file: req.file?.mimetype ?? null}))
	server = app.listen(0)
	await new Promise(resolve => server.once('listening', resolve))
	url = `http://127.0.0.1:${server.address().port}/upload`
})

test.after(() => {
	server.close()
	process.chdir(cwd)
	rmSync(dir, {recursive: true, force: true})
})

const upload = (type, name) => {
	const form = new FormData()
	form.append('image', new Blob(['data'], {type}), name)
	return fetch(url, {method: 'POST', body: form}).then(res => res.json())
}

test('png and jpeg images are stored', async () => {
	assert.deepEqual(await upload('image/png', 'a.png'), {file: 'image/png'})
	assert.deepEqual(await upload('image/jpeg', 'b.jpg'), {file: 'image/jpeg'})
	assert.equal(readdirSync(join(dir, 'images')).length, 2)
})

test('other file types are skipped and never written to disk', async () => {
	const before = readdirSync(join(dir, 'images')).length
	assert.deepEqual(await upload('text/html', 'x.html'), {file: null})
	assert.deepEqual(await upload('application/pdf', 'y.pdf'), {file: null})
	assert.equal(readdirSync(join(dir, 'images')).length, before)
})
