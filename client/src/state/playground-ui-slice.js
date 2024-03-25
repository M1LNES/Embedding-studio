import { createSlice } from '@reduxjs/toolkit'
/**
 * Redux slice defining the playground user interface (UI) reducer and its actions.
 * Manages state related to modal visibility within the playground UI, allowing opening and closing of modals.
 * This file exports action creators and the reducer function.
 */

const initialState = {
	modalOpen: {
		codeModal: false,
		styleModal: false,
		paramsModal: false,
	},
}

export const playgroundUIReducer = createSlice({
	name: 'playgroundUI',
	initialState,
	reducers: {
		openModal: (state, action) => {
			state.modalOpen[action.payload] = true
		},
		closeModal: (state, action) => {
			state.modalOpen[action.payload] = false
		},
	},
})

export const { closeModal, openModal } = playgroundUIReducer.actions
export default playgroundUIReducer.reducer
