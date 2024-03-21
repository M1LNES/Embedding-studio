const express = require('express')
const apiRouter = require('../server/api-router')
const nonApiRouter = require('../server/non-api-router')
const { routes } = require('empli-embed')
console.log(routes)
const cors = require('cors')
const path = require('path')

const historyApiFallback = require('express-history-api-fallback')
const devHistoryApiFallback = require('../server/dev-history-api-fallback')

const app = express()
app.use(cors())
app.use(express.json())

require('dotenv').config()

const port = process.env.PORT || 5000
const DIST_DIR = path.resolve(__dirname, '../dist')

const start = () => {
	app.use('/api', routes)
	app.use('/api', apiRouter)
	app.use('/', nonApiRouter)

	if (process.env.NODE_ENV === 'production') {
		app.use('/vendor', express.static(path.resolve(DIST_DIR, 'vendor')))
		app.use(express.static(DIST_DIR))
		app.use(
			historyApiFallback('index.html', {
				root: DIST_DIR,
			})
		)
	} else {
		const webpackDevMiddleware = require('webpack-dev-middleware')
		const config = require('../webpack.config.dev')
		const compiler = require('webpack')(config)
		wdMiddleware = webpackDevMiddleware(compiler)

		app.use(require('webpack-hot-middleware')(compiler))
		app.use(wdMiddleware)
		app.use(devHistoryApiFallback(wdMiddleware, config))
	}

	return new Promise((resolve) => {
		app.listen(port, function () {
			console.log(`listening on port http://localhost:${port}`)
			resolve(this)
		})
	})
}

start().catch((e) => {
	console.log(e)
})
