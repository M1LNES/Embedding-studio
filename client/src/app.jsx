import React from 'react'
import Playground from './components/playground'
import { Provider } from 'react-redux'
import { store } from './state/store'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const App = () => {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<Routes>
						<Route path='/idk' element={<h2>ahoj</h2>} />

						<Route path='/' element={<Playground />} />
					</Routes>
				</Provider>
			</QueryClientProvider>
		</BrowserRouter>
	)
}

export default App
