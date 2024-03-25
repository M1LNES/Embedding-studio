const express = require('express')
const axios = require('axios')

const apiRouter = express.Router()

let publicApiTokenRequests = []
let omniStudioApiTokenRequests = []

apiRouter.post('/add-omni-request', async (req, res) => {
	const { requestID, token } = req.body

	const newRequest = { requestID, token }

	omniStudioApiTokenRequests.push(newRequest)

	res
		.status(200)
		.json({ message: 'Request added to omniStudioApiTokenRequests array' })
})

apiRouter.post('/add-public-api-request', async (req, res) => {
	const { requestID, token } = req.body

	const newRequest = { requestID, token }

	publicApiTokenRequests.push(newRequest)

	res
		.status(200)
		.json({ message: 'Request added to PublicApiTokenRequests array' })
})

function getAuthorization() {
	return `Basic ${Buffer.from(
		`${process.env.CLIENT_ID_PUBLIC_API}:${process.env.CLIENT_SECRET_PUBLIC_API}`
	).toString('base64')}`
}

apiRouter.get('/callback-omni-token', async (req, res) => {
	// const public_url = process.env.PUBLIC_API_URL + '/3/omni-studio'
	// const pathUrl = `/oauth2/token`
	// const uri = `${req.protocol}://${req.get('host')}/api${req.path}`

	// const payload = {
	// 	method: 'POST',
	// 	path: pathUrl,
	// 	headers: {
	// 		Accept: 'application/json',
	// 		'Content-Type': 'application/x-www-form-urlencoded',
	// 		authorization: `Basic ${Buffer.from(
	// 			`${process.env.CLIENT_ID_OMNI_STUDIO}:${process.env.CLIENT_SECRET_OMNI_STUDIO}`
	// 		).toString('base64')}`,
	// 	},
	// 	body: {
	// 		grant_type: 'authorization_code',
	// 		code: req.query.code,
	// 		redirect_uri: uri,
	// 	},
	// }

	// const response = await axios.post(public_url, payload, {
	// 	headers: {
	// 		Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
	// 		'content-type': `application/json`,
	// 		'x-sbks-token': `oauth`,
	// 	},
	// })

	// console.log(response.data)
	// res.json(response.data)
	const uri = `${req.protocol}://${req.get('host')}/api${req.path}`
	console.log('OMNI URI: ', uri)
	const response = await fetch(
		`${process.env.OAUTH_PROVIDER_OMNI_STUDIO}/token`,
		{
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(
					`${process.env.CLIENT_ID_OMNI_STUDIO}:${process.env.CLIENT_SECRET_OMNI_STUDIO}`
				).toString('base64')}`,
			},
			body: `grant_type=authorization_code&code=${req.query.code}&redirect_uri=${uri}`,
		}
	)
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
		console.dir({ url, params }, { depth: null })
		console.log(JSON.stringify({ params, url }, null, 2))

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

apiRouter.get('/public-api-token/:id', async (req, res) => {
	const { id } = req.params

	const tokenObject = publicApiTokenRequests.find((obj) => obj.requestID === id)
	if (tokenObject) {
		res.send(tokenObject)
	} else {
		res.json({ message: 'Token not found' })
	}
})

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

const catchErr = (fn) => async (req, res, next) => {
	try {
		await fn(req, res, next)
	} catch (e) {
		if (typeof e.code !== 'number') e.code = 500
		next(e)
	}
}

apiRouter.get(
	'/omni-studio-me-endpoint',
	catchErr(async (req, res) => {
		const token = req.headers['x-token']

		try {
			const apiUrl = process.env.OMNI_STUDIO_API_URL + '/0/users/me'
			const headers = {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			}

			const response = await axios.get(apiUrl, { headers })
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
