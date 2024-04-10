const express = require('express')
const axios = require('axios')

const apiRouter = express.Router()

/**
 * Array to store public API token requests.
 */
let publicApiTokenRequests = []

/**
 * Array to store Omni Studio API token requests.
 */
let omniStudioApiTokenRequests = []

/**
 * Adds a new Omni Studio API token request to the array.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
apiRouter.post('/add-omni-request', async (req, res) => {
	const { requestID, token } = req.body

	const newRequest = { requestID, token }

	omniStudioApiTokenRequests.push(newRequest)

	res
		.status(200)
		.json({ message: 'Request added to omniStudioApiTokenRequests array' })
})

/**
 * Adds a new public API token request to the array.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
apiRouter.post('/add-public-api-request', async (req, res) => {
	const { requestID, token } = req.body

	const newRequest = { requestID, token }

	publicApiTokenRequests.push(newRequest)

	res
		.status(200)
		.json({ message: 'Request added to PublicApiTokenRequests array' })
})

/**
 * Generates the authorization header value for API requests.
 *
 * @returns {string} - The authorization header value.
 */
function getAuthorization() {
	return `Basic ${Buffer.from(
		`${process.env.CLIENT_ID_PUBLIC_API}:${process.env.CLIENT_SECRET_PUBLIC_API}`
	).toString('base64')}`
}

/**
 * Handles the callback from Omni Studio for token retrieval.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
apiRouter.get('/callback-omni-token', async (req, res) => {
	const uri = `$https://${req.get('host')}/api${req.path}`

	const response = await fetch(
		`${process.env.PUBLIC_API_URL}/3/omni-studio/oauth2/token`,
		{
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
			},
			body: JSON.stringify({
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${Buffer.from(
						`${process.env.CLIENT_ID_OMNI_STUDIO}:${process.env.CLIENT_SECRET_OMNI_STUDIO}`
					).toString('base64')}`,
				},
				body: `grant_type=authorization_code&code=${res.req.query.code}&redirect_uri=${uri}`,
			}),
		}
	)
	// const response = await fetch(
	// 	`${process.env.OAUTH_PROVIDER_OMNI_STUDIO}/token`,
	// 	{
	// 		method: 'post',
	// 		headers: {
	// 			Accept: 'application/json',
	// 			'Content-Type': 'application/x-www-form-urlencoded',
	// 			Authorization: `Basic ${Buffer.from(
	// 				`${process.env.CLIENT_ID_OMNI_STUDIO}:${process.env.CLIENT_SECRET_OMNI_STUDIO}`
	// 			).toString('base64')}`,
	// 		},
	// 		body: `grant_type=authorization_code&code=${req.query.code}&redirect_uri=${uri}`,
	// 	}
	// )
	const responseBody = await response.json()

	if (responseBody.error)
		throw new Error(responseBody.error + ': ' + responseBody.error_description)
	const index = omniStudioApiTokenRequests.findIndex(
		(obj) => obj.requestID === req.query.state
	)

	if (index !== -1) {
		omniStudioApiTokenRequests[index].token = responseBody
	} else {
		console.error('Object not found with id:', req.query.state)
	}
	return res.send('<script>window.close();</script > ')
})

/**
 * Handles the callback from the public API for token retrieval.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
apiRouter.get('/callback', async (req, res) => {
	if (res.req.query.code) {
		const uri = `https://${req.get('host')}/api${req.path}`
		const url = `${process.env.OAUTH_PROVIDER_PUBLIC_API_URL}/token`
		const params = {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: getAuthorization(),
			},
			body: `grant_type=authorization_code&code=${req.query.code}&redirect_uri=${uri}`,
		}

		const tokenResponse = await (await fetch(url, params)).json()
		const index = publicApiTokenRequests.findIndex(
			(obj) => obj.requestID === req.query.state
		)
		if (index !== -1) {
			publicApiTokenRequests[index].token = tokenResponse
		} else {
			console.error('Object not found with id:', req.query.state)
		}

		return res.send('<script>window.close();</script > ')
	}

	return res.send(null)
})

/**
 * Retrieves a public API token by ID.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
apiRouter.get('/public-api-token/:id', async (req, res) => {
	const { id } = req.params

	const tokenObject = publicApiTokenRequests.find((obj) => obj.requestID === id)
	if (tokenObject) {
		res.send(tokenObject)
	} else {
		res.json({ message: 'Token not found' })
	}
})

/**
 * Retrieves an Omni Studio API token by ID.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
apiRouter.get('/omni-studio-api-token/:id', async (req, res) => {
	const { id } = req.params
	const tokenObject = omniStudioApiTokenRequests.find(
		(obj) => obj.requestID === id
	)
	if (tokenObject) {
		res.send(tokenObject)
	} else {
		res.json({ message: 'Token not found' })
	}
})

/**
 * Middleware to catch errors and pass them to the error handler.
 *
 * @param {Function} fn - The asynchronous route handler function.
 * @returns {Function} - The wrapped function.
 */
const catchErr = (fn) => async (req, res, next) => {
	try {
		await fn(req, res, next)
	} catch (e) {
		if (typeof e.code !== 'number') e.code = 500
		next(e)
	}
}

/**
 * Fetches data from Omni Studio API.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
apiRouter.get(
	'/omni-studio-me-endpoint',
	catchErr(async (req, res) => {
		const publicApiToken =
			req.headers['x-pbtoken'] !== 'undefined'
				? req.headers['x-pbtoken']
				: process.env.ACCESS_TOKEN
		const omniApiToken =
			req.headers['x-ostoken'] !== 'undefined'
				? req.headers['x-ostoken']
				: process.env.OMNI_API_TOKEN

		try {
			const pathUrl = process.env.OMNI_STUDIO_API_URL + '/0/users/me'
			const publicApiUrl = process.env.PUBLIC_API_URL + '/3/omni-studio'

			const payload = {
				method: 'GET',
				path: pathUrl,
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${omniApiToken}`,
				},
			}

			const response = await axios.post(publicApiUrl, payload, {
				headers: {
					Authorization: `Bearer ${publicApiToken}`,
					'content-type': `application/json`,
					'x-sbks-token': `oauth`,
				},
			})

			res.json(response.data)
		} catch (error) {
			if (error.response && error.response.data && error.response.data.error) {
				res.status(500).json({ error: error.response.data.error })
			} else {
				res.status(500).json({
					error: 'Error during fetching data from the Omni Studio API',
				})
			}
		}
	})
)

/**
 * Fetches data from the public API.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
apiRouter.get(
	'/public-api-me-endpoint',
	catchErr(async (req, res) => {
		const token = req.headers['x-token']

		const tokenResponse = await (
			await fetch(
				`${process.env.OAUTH_PROVIDER_PUBLIC_API_URL}/token/introspection`,
				{
					method: 'post',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: getAuthorization(),
					},
					body: `token=${token}`,
				}
			)
		).json()

		res.send(tokenResponse)
	})
)

module.exports = apiRouter
