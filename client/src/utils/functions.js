/**
 * Parses a JSON string into a JavaScript object.
 *
 * @param {string} str - The JSON string to parse.
 * @returns {Object|null} - The parsed JavaScript object, or null if parsing fails.
 */
export const parseJSON = (str) => {
	try {
		return JSON.parse(str)
	} catch (e) {
		return null
	}
}

/**
 * Extracts and cleans a parameter value, returning null if it's empty or 'null'.
 *
 * @param {string} paramValue - The parameter value to clean.
 * @returns {string|null} - The cleaned parameter value, or null if it's empty or 'null'.
 */
export const extractParameterValue = (paramValue) => {
	const finalValue =
		paramValue && paramValue.trim() !== '' && paramValue !== 'null'
			? paramValue
			: null
	return finalValue
}

/**
 * Parses a value to an integer, returning null if parsing fails.
 *
 * @param {string} value - The value to parse to an integer.
 * @returns {number|null} - The parsed integer value, or null if parsing fails.
 */
export const parseToInteger = (value) => {
	const parsedValue = parseInt(value)
	return !isNaN(parsedValue) ? parsedValue : null
}

/**
 * Asynchronously fetches a public API token from the server.
 *
 * @param {string} id - The ID associated with the token request.
 * @returns {Promise<string|null>} - A promise resolving to the fetched token, or null if an error occurs.
 */
export async function getPublicApiToken(id) {
	try {
		let token = null
		await fetch('/api/add-public-api-request', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ requestID: id, token: null }),
		})
		while (token === null) {
			await sleep(500)

			const tokenResponse = await fetch(`/api/public-api-token/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (tokenResponse.ok) {
				token = await tokenResponse.json()
				console.log(token)
				token = token.token
			}
		}

		return token
	} catch (error) {
		console.error('Error fetching token from server:', error)
		return null
	}
}

/**
 * Asynchronously fetches an OmniStudio API token from the server.
 *
 * @param {string} id - The ID associated with the token request.
 * @returns {Promise<string|null>} - A promise resolving to the fetched token, or null if an error occurs.
 */
export async function getOmniStudioApiToken(id) {
	try {
		let token = null
		await fetch('/api/add-omni-request', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ requestID: id, token: null }),
		})

		while (token === null) {
			await sleep(500)
			const tokenResponse = await fetch(`/api/omni-studio-api-token/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (tokenResponse.ok) {
				token = await tokenResponse.json()
				token = token.token
			}
		}

		return token
	} catch (error) {
		console.error('Error fetching token from server:', error)
		return null
	}
}

/**
 * Asynchronously waits for a specified amount of time.
 *
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} - A promise that resolves after the specified time.
 */
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generates a random alphanumeric string to be used as a request ID.
 *
 * @returns {string} - The generated request ID.
 */
export const makeRequestID = () => {
	let result = ''
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	let counter = 0
	while (counter < 10) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
		counter += 1
	}
	return result
}
