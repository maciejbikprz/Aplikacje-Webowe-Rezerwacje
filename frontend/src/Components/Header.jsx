import Footer from "./Footer";
import { Link } from 'react-router-dom';

// Odbieramy propsy z App.js
function Header({ isAuthenticated, userRole, onLogout }) {
    
    // Sprawdzamy czy to admin na podstawie propsa
    const isAdmin = userRole === 'admin';

    return (
        <>
            <header className="document-header">
                <div className="brand">
                    <Link to="/">Sail-Manager</Link>
                    {isAdmin && <p className="admin-text">Panel administratora</p>}
                </div>
                
                <nav className="document-navigation">
                    <Link to="/" className="document-navigation__link">Strona główna</Link>
                    
                    {isAdmin && (
                        <Link to="/ExampleAdd" className="document-navigation__link">Example Add</Link>
                    )}

                    {isAuthenticated ? (
                        <button onClick={onLogout} className="document-navigation__link" style={{background:'none', border:'none', cursor:'pointer', color: 'inherit', fontSize: 'inherit'}}>
                            Wyloguj się
                        </button>
                    ) : (
                        <>
                            <Link to="/register" className="document-navigation__link">Zarejestruj się</Link>
                            <Link to="/login" className="document-navigation__link">Zaloguj się</Link>
                        </>
                    )}
                    
                </nav>
                <Footer/>
            </header>
        </>
    )
}

export default Header;