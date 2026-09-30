import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Components/Dashboard'
import Layout from './Components/Layout'
import Transactions from './Pages/Transactions'
import Accounts from "./Pages/Accounts"

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/transactions" element={<Transactions />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default App