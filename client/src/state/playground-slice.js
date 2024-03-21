import { createSlice } from '@reduxjs/toolkit'
import { parseJSON } from '../utils/functions'
const initialState = {
	widgetID: null,
	boardID: null,
	width: null,
	height: null,
	showConfig: false,
	showConfigRevealed: false,
	className: null,
	style: null,
	params: null,
	widgetCode: null,
	visualizationState: null,
	omniStudioTokenState: {
		valid: null,
		availability: null,
	},
	publicApiTokenState: {
		valid: null,
		availability: null,
	},
	styleValid: false,
	paramsValid: false,
}
export const playgroundReducer = createSlice({
	name: 'playground',
	initialState,
	reducers: {
		changeWidgetID: (state, action) => {
			const parsedWidgetID = parseInt(action.payload)
			if (!isNaN(parsedWidgetID)) {
				state.widgetID = parsedWidgetID
			} else {
				state.widgetID = null
			}
		},
		changeBoardID: (state, action) => {
			const parsedBoardID = parseInt(action.payload)
			if (!isNaN(parsedBoardID)) {
				state.boardID = parsedBoardID
			} else {
				state.boardID = null
			}
		},
		changeHeight: (state, action) => {
			const parsedHeight = parseInt(action.payload)
			if (!isNaN(parsedHeight)) {
				state.height = parsedHeight
			} else {
				state.height = null
			}
		},
		changeWidth: (state, action) => {
			const parsedWidth = parseInt(action.payload)
			if (!isNaN(parsedWidth)) {
				state.width = parsedWidth
			} else {
				state.width = null
			}
		},
		changeShowConfig: (state, action) => {
			state.showConfig = action.payload
		},
		changeShowConfigRevealed: (state, action) => {
			state.showConfigRevealed = action.payload
		},
		changeClassName: (state, action) => {
			state.className = action.payload
		},
		changeStyle: (state, action) => {
			state.style = action.payload
			state.styleValid = parseJSON(action.payload) !== null
		},
		changeParams: (state, action) => {
			state.params = action.payload
			state.paramsValid = parseJSON(action.payload) !== null
		},
		changeWidgetCode: (state, action) => {
			state.widgetCode = action.payload
		},
		changeVisualizationState: (state, action) => {
			state.visualizationState = action.payload
		},
		changeOmniStudioTokenState: (state, action) => {
			state.omniStudioTokenState = action.payload
		},
		changePublicApiTokenState: (state, action) => {
			state.publicApiTokenState = action.payload
		},
		initialiseState: (state, action) => {
			const {
				widgetID,
				boardID,
				width,
				height,
				style,
				params,
				className,
				showConfig,
				showConfigRevealed,
				widgetCode,
				visualizationState,
				omniStudioTokenState,
				publicApiTokenState,
				paramsValid,
				styleValid,
			} = action.payload
			return {
				widgetID,
				boardID,
				width,
				height,
				style,
				params,
				className,
				showConfig,
				showConfigRevealed,
				widgetCode,
				visualizationState,
				omniStudioTokenState,
				publicApiTokenState,
				paramsValid,
				styleValid,
			}
		},
	},
})

export const {
	changeBoardID,
	changeWidgetID,
	changeHeight,
	changeWidth,
	changeShowConfigRevealed,
	changeShowConfig,
	changeClassName,
	changeParams,
	changeStyle,
	changeWidgetCode,
	changeVisualizationState,
	changePublicApiTokenState,
	changeOmniStudioTokenState,
	initialiseState,
} = playgroundReducer.actions
export default playgroundReducer.reducer
