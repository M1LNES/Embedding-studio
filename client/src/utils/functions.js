export const parseJSON = (str) => {
	try {
		return JSON.parse(str)
	} catch (e) {
		return null
	}
}

export const extractParameterValue = (paramValue) => {
	const finalValue =
		paramValue && paramValue.trim() !== '' && paramValue !== 'null'
			? paramValue
			: null
	return finalValue
}

export const parseToInteger = (value) => {
	const parsedValue = parseInt(value)
	return !isNaN(parsedValue) ? parsedValue : null
}

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
		while (token === null && token !== 'undefined') {
			await sleep(500)

			const tokenResponse = await fetch(`/api/public-api-token/${id}`, {
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

		// await fetch('/api/reset-omni-studio-api-token', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({ id: id }),
		// })

		return token
	} catch (error) {
		console.error('Error fetching token from server:', error)
		return null
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

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
