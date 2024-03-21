import { configureStore } from '@reduxjs/toolkit'
import playgroundReducer from './playground-slice'
import playgroundUIReducer from './playground-ui-slice'
export const store = configureStore({
	reducer: {
		playground: playgroundReducer,
		playgroundUI: playgroundUIReducer,
	},
})
