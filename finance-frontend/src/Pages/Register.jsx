import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

function Register() {
    const [userName, setUserName] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()

        setErrorMessage('')

        try {
            const response = await fetch('https://localhost:7012/api/Auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: userName,
                    emailAddress: emailAddress,
                    password: password
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setErrorMessage(data.message || 'Registration failed')
                return
            }

            navigate('/login')
        } catch {
            setErrorMessage('Unable to connect to the server')
        }
    }

    return (
        <div className="auth-page">
            <Header />

            <h1>Create Account</h1>

            <form onSubmit={handleRegister}>
                <div className="form-field">
                    <label>Username</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {errorMessage && (
                    <p>{errorMessage}</p>
                )}

                <button type="submit">Register</button>
            </form>

            <p className="auth-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>

            <Footer />
        </div>
    )
}

export default Register