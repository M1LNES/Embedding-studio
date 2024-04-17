// Import required modules
const express = require('express')
const apiRouter = require('./api-router')
const nonApiRouter = require('./non-api-router')
const { routes } = require('empli-embed') // Import routes from 'empli-embed' module
const cors = require('cors')
const path = require('path')
const httpsRedirect = require('./https-redirect')

// Import middleware for handling history fallback
const historyApiFallback = require('express-history-api-fallback')
const devHistoryApiFallback = require('../server/dev-history-api-fallback')

// Create an Express application
const app = express()

// Enable CORS
app.use(cors())

// Parse JSON bodies
app.use(express.json())

app.use(httpsRedirect)

// Load environment variables from .env file
require('dotenv').config()

// Set the port for the server to listen on
const port = process.env.PORT || 5000

// Define the path to the distribution directory
const DIST_DIR = path.resolve(__dirname, '../dist')

// Function to start the Express server
const start = () => {
	let wdMiddleware = null

	// Set routes under the '/api' path
	app.use('/api', routes, apiRouter, nonApiRouter)
	// app.use('/api', apiRouter)
	// app.use('/api', nonApiRouter)

	// Serve static files in production
	if (process.env.NODE_ENV === 'production') {
		// Serve vendor files
		app.use('/vendor', express.static(path.resolve(DIST_DIR, 'vendor')))
		// Serve static files from the distribution directory
		app.use(express.static(DIST_DIR))
		// Handle history API fallback for client-side routing
		app.use(
			historyApiFallback('index.html', {
				root: DIST_DIR,
			})
		)
	} else {
		// Enable webpack development middleware in development mode
		const webpackDevMiddleware = require('webpack-dev-middleware')
		const config = require('../webpack.config.dev')
		const compiler = require('webpack')(config)
		wdMiddleware = webpackDevMiddleware(compiler)

		// Enable webpack hot module replacement middleware
		app.use(require('webpack-hot-middleware')(compiler))
		// Use webpack development middleware
		app.use(wdMiddleware)
		// Handle history API fallback for client-side routing in development mode
		app.use(devHistoryApiFallback(wdMiddleware, config))
	}

	// Start the server and return a Promise
	return new Promise((resolve) => {
		app.listen(port, function () {
			console.log(`listening on port http://localhost:${port}`)
			resolve(this)
		})
	})
}

// Start the server and handle errors
start().catch((e) => {
	console.log(e)
})
