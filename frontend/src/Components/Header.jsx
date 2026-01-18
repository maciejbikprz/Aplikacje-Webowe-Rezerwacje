import Footer from "./Footer";
import { useState } from "react";
import { Link } from 'react-router-dom';

var admin = true;
function Header() {
    return (
        <>
            <header className="document-header">
                <div className="brand"><Link to="/">Sail-Manager</Link>
                {admin ? <p className="admin-text">Panel administratora</p> : null}
                </div>
                <nav className="document-navigation">
                    {/* <a href="#" className="document-navigation__link">Zaloguj się</a> */}
                    <Link to="/" className="document-navigation__link">Strona główna</Link>
                    <Link to="/ExampleAdd" className="document-navigation__link">Example Add</Link>
                    <Link to="/register" className="document-navigation__link">Zarejestruj się</Link>
                    <Link to="/login" className="document-navigation__link">Zaloguj się</Link>
                    
                </nav>
                <Footer/>
            </header>
        </>
    )
}

export default Header;