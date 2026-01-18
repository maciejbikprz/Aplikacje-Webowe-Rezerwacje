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
                    <Link to="/">Sail 
                    <div class="brand__reservation">Reservation</div></Link>
                    {isAdmin && <p className="admin-text">Panel administratora</p>}
                </div>
                
                <nav className="document-navigation">
                    <Link to="/" className="document-navigation__link">Strona główna</Link>
                    <Link to="/boats" className="document-navigation__link">Przegladaj łodzie</Link>
                    {isAuthenticated && (<Link to="/dashboard" className="document-navigation__link">Moje rezerwacje</Link>)}
                    {isAdmin && (
                        <>
                        {/* <Link to="/ExampleAdd" className="document-navigation__link">Example Add</Link> */}
                        <Link to="/adminPanel" className="document-navigation__link">Admin Panel</Link>
                        </>
                    )}
                    {isAuthenticated ? (
                        <a onClick={onLogout} className="document-navigation__link">
                            Wyloguj się
                        </a>
                    ) : (
                        <>
                            <Link to="/login" className="document-navigation__link">Zaloguj się</Link>
                            {/* <Link to="/register" className="document-navigation__link">Zarejestruj się</Link> */}
                        </>
                    )}
                    
                    

                    
                    
                </nav>
                <Footer/>
            </header>
        </>
    )
}

export default Header;