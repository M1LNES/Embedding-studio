import {
	OMNI_STUDIO_FETCHING_ERROR,
	OMNI_STUDIO_OK,
	PUBLIC_API_FETCHING_ERROR,
	PUBLIC_API_INVALID,
	PUBLIC_API_OK,
} from '../constants/token-messages'

export const checkPublicApiTokenValidity = async (token) => {
	try {
		const response = await fetch('/api/public-api-me-endpoint', {
			method: 'GET',
			headers: {
				'X-Token': token,
			},
		})

		const data = await response.json()

		if (data.active) {
			return { valid: true, message: PUBLIC_API_OK }
		} else {
			return { valid: false, message: PUBLIC_API_INVALID }
		}
	} catch (error) {
		return {
			valid: false,
			message: PUBLIC_API_FETCHING_ERROR,
		}
	}
}

export const checkOmniStudioTokenValidity = async (omniToken, publicToken) => {
	try {
		const response = await fetch('/api/omni-studio-me-endpoint', {
			method: 'GET',
			headers: {
				'X-OSToken': omniToken,
				'X-PBToken': publicToken,
			},
		})

		const data = await response.json()
		if (!response.ok) {
			return { valid: false, message: data.error }
		}

		return { valid: true, message: OMNI_STUDIO_OK }
	} catch (error) {
		return {
			valid: false,
			message: OMNI_STUDIO_FETCHING_ERROR,
		}
	}
}
