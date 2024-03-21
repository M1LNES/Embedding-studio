import { createSlice } from '@reduxjs/toolkit'

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
