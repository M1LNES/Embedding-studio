import React from 'react'
import Playground from './components/playground'
import { Provider } from 'react-redux'
import { store } from './state/store'

const App = () => {
	return (
		<Provider store={store}>
			<Playground />
		</Provider>
	)
}

export default App
