import React from 'react';
import { Link } from "react-router-dom";

const Nav = ({ name, setName }) => {
    const logout = async () => {
        await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain', },
            credentials: 'include',
        });

        setName('');
    }

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Home</Link>
                <div>
                    {name === '' ? (
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item active">
                                <Link to="/principal-login" className="nav-link">Login</Link>
                            </li>
                            <li className="nav-item active">
                                <Link to="/register" className="nav-link">Register</Link>
                            </li>
                        </ul>
                    ) : (
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item active">
                                <Link to="/principal-login" className="nav-link" onClick={logout}>Logout</Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
