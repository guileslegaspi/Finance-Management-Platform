import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

function Login() {
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        setErrorMessage('')

        try {
            const response = await fetch('https://localhost:7012/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailAddress: emailAddress,
                    password: password
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setErrorMessage(data.message || 'Login failed')
                return
            }

            localStorage.setItem('token', data.token)

            navigate('/dashboard')
        } catch {
            setErrorMessage('Unable to connect to the server')
        }

        
    }

    return (
        <div className="auth-page">
            <Header/>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <div className="form-field">
                    <label>Email</label>
                    <input type="email"
                           value={emailAddress}
                           onChange={(e) => setEmailAddress(e.target.value)}
                           />
                </div>

                <div className="form-field">
                    <label>Password</label>
                    <input type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           />
                </div>

                {errorMessage && (
                    <p>{errorMessage}</p>
                )}

                <button type="submit">Login</button>

            </form>

            <p className="auth-link">
                Don't have an account? <Link to="/register">Create one</Link>
            </p>
            <Footer/>
        </div>
    )
}

export default Login