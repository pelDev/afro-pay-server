import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Dashboard'
import Register from './Register'
import Login from './Login';
import Success from './Success';

function App() {

  return (
    <BrowserRouter>
    <Routes>
        <Route path="/success" element={<Success />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<Register />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
