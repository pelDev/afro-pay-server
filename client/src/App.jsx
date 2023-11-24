import { useState } from 'react'
import './App.css'
import WebSocketComponent from './WebSocket'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WebSocketComponent />
    </>
  )
}

export default App
