import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCoffee, FaBars, FaTimes } from 'react-icons/fa'
import './Navbar.css'

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location])

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/menu', label: 'Menu' },
        { path: '/orders', label: 'Orders' },
        { path: '/contact', label: 'Contact' },
        { path: '/profile', label: '👤 Profile' }
    ]

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    <FaCoffee className="logo-icon" />
                    <span className="logo-text">Café Delight</span>
                </Link>

                <ul className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu-open' : ''}`}>
                    {navLinks.map((link) => (
                        <li key={link.path} className="navbar-item">
                            <Link
                                to={link.path}
                                className={`navbar-link ${location.pathname === link.path ? 'navbar-link-active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <button
                    className="navbar-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>
        </nav>
    )
}

export default Navbar
