import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from "react-toastify"
import { ChakraProvider } from '@chakra-ui/react'
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <React.StrictMode>
      <App />
      <ToastContainer />
    </React.StrictMode>
  </ChakraProvider>
)
