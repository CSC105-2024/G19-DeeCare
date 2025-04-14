import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import LoginOverlay from "./LoginOverlay.jsx";

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
            <nav className="bg-pri text-white fixed top-0 left-0 right-0 w-full z-50">
                <div className="max-w-[1280px] flex items-center h-[72px] px-6 justify-between">
                    {/* Left: Logo */}
                    <NavLink to="/" className="flex items-center gap-2">
                        <img
                            src="icons/fullLogo.png"
                            alt="fullLogo"
                            className="h-6"
                        />
                    </NavLink>

                    {/* Middle + Right: Menu links and buttons */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Nav Links */}
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? "text-yellow-300" : "hover:text-yellow-300"
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/FindDoctor"
                            className={({ isActive }) =>
                                isActive ? "text-yellow-300" : "hover:text-yellow-300"
                            }
                        >
                            Appointment
                        </NavLink>

                        {/* Divider */}
                        <div className="w-px h-5 bg-white opacity-30 mx-2" />

                        {/* Auth Buttons */}
                        <NavLink
                            to="/Login"
                            className="bg-[#FFA500] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#e69500] transition-all"
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/Register"
                            className="border border-white text-white px-4 py-2 rounded text-sm font-medium hover:bg-white hover:text-[#0D47A1] transition-all"
                        >
                            Register
                        </NavLink>
                    </div>

                    {/* Mobile: Hamburger */}
                    <div className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                        <span className="text-2xl cursor-pointer">{menuOpen ? "✕" : "☰"}</span>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white text-black px-4 py-2 space-y-2 border-t">
                        <NavLink to="/" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                            Home
                        </NavLink>
                        <NavLink to="/FindDoctor" className="block hover:text-blue-600" 
                        onClick={() => setMenuOpen(false)}>
                            Appointment
                        </NavLink>
                        <NavLink to="/Login" className="block hover:text-blue-600" 
                        onClick={() => setMenuOpen(false)}>
                            Login
                        </NavLink>
                        <NavLink to="/Register" className="block hover:text-blue-600" 
                        onClick={() => setMenuOpen(false)}>
                            Register
                        </NavLink>
                    </div>
                )}
            </nav>

            {/* Login Modal (if using one) */}
            {isLoginOpen && <LoginOverlay onClose={() => setIsLoginOpen(false)} />}

            <div className="pt-[72px]">
                <Outlet />
            </div>
        </>
    );
};

export default NavBar;
