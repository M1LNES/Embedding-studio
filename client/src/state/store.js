import { configureStore } from '@reduxjs/toolkit'
import playgroundReducer from './playground-slice'
import playgroundUIReducer from './playground-ui-slice'

/**
 * Configures the Redux store using Redux Toolkit.
 * Combines the reducers from 'playground-slice' and 'playground-ui-slice' into the root reducer.
 * This store manages the application's state using the specified reducers.
 */

export const store = configureStore({
	reducer: {
		playground: playgroundReducer,
		playgroundUI: playgroundUIReducer,
	},
})
