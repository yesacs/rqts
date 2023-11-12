import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import RandomCard from './features/Card/components/Random'

import './App.css'

const router = createBrowserRouter([
  {
    path: '/:searchTerm',
    element: <RandomCard />,
    loader: ({ params }) => params,
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  )
}

export default App
