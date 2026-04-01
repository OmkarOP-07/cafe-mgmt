import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaCoffee, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useUser } from '../context/UserContext'

export default function Login() {
    const { loginUser } = useUser()
    const navigate = useNavigate()
    const location = useLocation()

    const [form, setForm] = useState({ email: '', password: '' })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const from = location.state?.from?.pathname || '/'

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const user = await loginUser({ email: form.email, password: form.password })
            if (user.isAdmin && from === '/') {
                navigate('/admin/menu')
            } else {
                navigate(from, { replace: true })
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="section container" style={{ maxWidth: '500px', marginTop: '4rem', marginBottom: '4rem' }}>
            <div className="glass-card animate-scaleIn" style={{ padding: 'var(--spacing-xl)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <FaCoffee style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem' }} />
                    <h2 style={{ color: 'var(--color-primary)' }}>Welcome Back</h2>
                    <p>Enter your details to sign in</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group" style={{ position: 'relative', marginBottom: 0 }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}><FaEnvelope /></span>
                        <input
                            type="email"
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Email address"
                            value={form.email}
                            onChange={e => setForm(p => ({...p, email: e.target.value}))}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ position: 'relative', marginBottom: 0 }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}><FaLock /></span>
                        <input
                            type={showPw ? "text" : "password"}
                            className="form-input"
                            style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                            placeholder="Password"
                            value={form.password}
                            onChange={e => setForm(p => ({...p, password: e.target.value}))}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                            tabIndex={-1}
                        >
                            {showPw ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}
