import React, {useState, useEffect} from "react";
import {NavLink, Outlet, useNavigate} from "react-router-dom";
import LoginOverlay from "./LoginOverlay.jsx";

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }

        // Listen for logout events
        const handleLogout = () => {
            setUser(null);
            setIsAuthenticated(false);
            setMenuOpen(false);
            navigate("/");
        };

        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, [navigate]);

    const handleLogin = (data) => {
        // data contains { user, token } from the API response
        setUser(data.user);
        setIsAuthenticated(true);
        setShowLogin(false);
        setMenuOpen(false);

        // Store user data and token
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);

        console.log('User logged in:', data.user);
    };

    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setMenuOpen(false);
        navigate("/");
    };

    const handleProfileClick = () => {
        setMenuOpen(false);
        navigate("/UserDetail"); // Navigate to UserDetail page
    };

    // New function to handle welcome text click
    const handleWelcomeClick = () => {
        navigate("/UserDetail");
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
                            className={({isActive}) =>
                                isActive ? "text-yellow-300" : "hover:text-yellow-600"
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/FindDoctor"
                            className={({isActive}) =>
                                isActive ? "text-yellow-300" : "hover:text-yellow-600"
                            }
                        >
                            Appointment
                        </NavLink>

                        {/* Conditional Auth Buttons */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-sm cursor-pointer hover:text-yellow-300 transition-colors"
                                        onClick={handleWelcomeClick}
                                    >
                                        Welcome, {user?.firstName || 'User'}
                                    </span>
                                    {user?.photo && (
                                        <img
                                            src={user.photo}
                                            alt="Profile"
                                            className="h-8 w-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-yellow-300 transition-all"
                                            onClick={handleProfileClick}
                                        />
                                    )}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="border-2 border-red-500 text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-red-500 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <div
                                    className="bg-yellow border-2 border-yellow text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-yellow transition-all">
                                    <button onClick={() => setShowLogin(true)}>Login</button>
                                </div>
                                <NavLink
                                    to="/Register"
                                    className="border-2 border-yellow text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-white hover:text-[#0D47A1] transition-all"
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        {isAuthenticated && user?.photo && (
                            <img
                                src={user.photo}
                                alt="Profile"
                                className="h-8 w-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-yellow-300 transition-all"
                                onClick={handleProfileClick}
                            />
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

                        {isAuthenticated ? (
                            <>
                                <div
                                    className="block py-2 cursor-pointer hover:text-blue-600"
                                    onClick={handleWelcomeClick}
                                >
                                    <span className="text-sm text-gray-600">
                                        Welcome, {user?.firstName || 'User'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleProfileClick}
                                    className="block w-full text-left hover:text-blue-600 py-1"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left hover:text-red-600 py-1"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <div
                                    className="justify-center bg-yellow border-2 border-yellow text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-yellow transition-all">
                                    <button onClick={() => setShowLogin(true)}>Login</button>
                                </div>
                                <NavLink
                                    to="/Register"
                                    className="block hover:text-blue-600"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Login Overlay */}
            {showLogin && (
                <LoginOverlay
                    onClose={() => setShowLogin(false)}
                    onLogin={handleLogin}
                />
            )}

            <div className="pt-[72px]">
                <Outlet/>
            </div>
        </>
    );
};

export default NavBar;