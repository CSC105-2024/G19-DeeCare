import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import LoginOverlay from "./LoginOverlay.jsx";

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (data) => {
        const newUser = {
            name: data.name,
            photo: data.photo,
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setShowLogin(false);
        setMenuOpen(false); 
        navigate("/"); 
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-pri text-white fixed top-0 left-0 right-0 w-full z-50">
                <div className="flex items-center h-[72px] px-6 justify-between">
                    <NavLink to="/" className="flex items-center gap-2">
                        <img
                            src="icons/fullLogo.png"
                            alt="fullLogo"
                            className="h-6"
                        />
                    </NavLink>

                    <div className="hidden md:flex items-center gap-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? "text-yellow-300" : "hover:text-yellow-600"
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/FindDoctor"
                            className={({ isActive }) =>
                                isActive ? "text-yellow-300" : "hover:text-yellow-600"
                            }
                        >
                            Appointment
                        </NavLink>
                        {/* Auth Buttons */}
                        <div className="bg-yellow border-2 border-yellow text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-yellow transition-all">
                            <button onClick={() => setShowLogin(true)}>Login</button>
                            {showLogin && (
                                <LoginOverlay
                                    onClose={() => setShowLogin(false)}
                                    onLogin={handleLogin}
                                />
                            )}
                        </div>
                        <NavLink
                            to="/Register"
                            className="border-2 border-yellow text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-white hover:text-[#0D47A1] transition-all"
                        >
                            Register
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        {user && (
                            <a href="/UserDetail">
                                <img
                                    src={user.photo}
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            </a>
                        )}
                        <div onClick={() => setMenuOpen(!menuOpen)}>
                            <span className="text-2xl cursor-pointer">{menuOpen ? "✕" : "☰"}</span>
                        </div>
                    </div>
                </div>

                {menuOpen && (
                    <div className="md:hidden bg-white text-black px-4 py-2 space-y-2 border-t">
                        <NavLink
                            to="/"
                            className="block hover:text-blue-600"
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/FindDoctor"
                            className="block hover:text-blue-600"
                            onClick={() => setMenuOpen(false)}
                        >
                            Appointment
                        </NavLink>

                     <div className="justify-center bg-yellow border-2 border-yellow text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-yellow transition-all">
                            <button onClick={() => setShowLogin(true)}>Login</button>
                            {showLogin && (
                                <LoginOverlay
                                    onClose={() => setShowLogin(false)}
                                    onLogin={handleLogin}
                                />
                            )}
                        </div>
                        <NavLink to="/Register" className="block hover:text-blue-600" 
                        onClick={() => setMenuOpen(false)}>
                            Register
                        </NavLink>
                    </div>
                )}
            </nav>

            <div className="pt-[72px]">
                <Outlet />
            </div>
        </>
    );
};

export default NavBar;
