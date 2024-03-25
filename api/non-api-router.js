const express = require('express')

const nonApiRouter = express.Router()

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
 * Route handler for setting up public API token.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
nonApiRouter.get(
	'/user/setup-public-api-token/:id',
	catchErr(async (req, res) => {
		res.redirect(getPublicApiCallbackUrl(req.params.id))
	})
)

/**
 * Generates the callback URL for setting up public API token.
 *
 * @param {string} id - The ID associated with the token request.
 * @returns {string} - The generated callback URL.
 */
function getPublicApiCallbackUrl(id) {
	const oauthProviderUrl = process.env.OAUTH_PROVIDER_PUBLIC_API_URL
	const clientId = process.env.CLIENT_ID_PUBLIC_API
	const callbackUrl = process.env.CALLBACK_URL_PUBKIC_API
	const state = id
	const scope = `${process.env.SCOPE_PUBLIC_API} offline_access`
	const prompt = 'consent'
	const responseType = 'code'

	const queryParams = new URLSearchParams({
		client_id: clientId,
		state: state,
		scope: scope,
		prompt: prompt,
		response_type: responseType,
		redirect_uri: callbackUrl,
	})

	const callbackUrlWithParams = `${oauthProviderUrl}/auth?${queryParams.toString()}`
	return callbackUrlWithParams
}

/**
 * Route handler for setting up Omni Studio API token.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
nonApiRouter.get(
	'/user/setup-omni-studio-api-token/:id',
	catchErr(async (req, res) => {
		res.redirect(getOmniStudioCallbackUrl(req.params.id))
	})
)

/**
 * Generates the callback URL for setting up Omni Studio API token.
 *
 * @param {string} id - The ID associated with the token request.
 * @returns {string} - The generated callback URL.
 */
function getOmniStudioCallbackUrl(id) {
	const oauthProvider = process.env.OAUTH_PROVIDER_OMNI_STUDIO
	const clientId = process.env.CLIENT_ID_OMNI_STUDIO
	const callbackUrl = process.env.CALLBACK_URL_OMNI_STUDIO
	const scope = 'user openid offline_access'
	const prompt = 'consent'
	const state = id

	const queryParams = new URLSearchParams({
		client_id: clientId,
		state: state,
		scope: scope,
		prompt: prompt,
		response_type: 'code',
		redirect_uri: callbackUrl,
	})

	const callbackUrlWithParams = `${oauthProvider}/auth?${queryParams.toString()}`

	return callbackUrlWithParams
}

module.exports = nonApiRouter
