import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import LoginOverlay from "./LoginOverlay.jsx";

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
            <nav className="bg-[#0D47A1] text-white fixed top-0 w-full z-50 shadow">
                <div className="max-w-[1280px] mx-auto flex items-center h-[72px] px-6 justify-between">
                    {/* Left: Logo */}
                    <NavLink to="/" className="flex items-center gap-2">
                        <img
                            src="images/apple-touch-icon" // Change to your actual logo path
                            alt="Logo"
                            className="w-6 h-6"
                        />
                        <span className="text-xl font-semibold tracking-wide">DEECARE</span>
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
                        <NavLink to="/" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Home</NavLink>
                        <NavLink to="/FindDoctor" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Appointment</NavLink>
                        <NavLink to="/Login" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Login</NavLink>
                        <NavLink to="/Register" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Register</NavLink>
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
// import React, {useState} from "react";
// import {NavLink, Outlet} from "react-router-dom";
// import LoginOverlay from "./LoginOverlay.jsx";
//
// const NavBar = () => {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [isLoginOpen, setIsLoginOpen] = useState(false);
//
//     return (
//         <>
//             <nav className="bg-primary text-white fixed top-0 w-full z-50">
//                 <div className="container mx-auto flex justify-between items-center h-[65px] px-4">
//                     {/* Hamburger Icon */}
//                     <div className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
//                         {menuOpen ? (
//                             <span className="text-2xl">✕</span>
//                         ) : (
//                             <span className="text-2xl">☰</span>
//                         )}
//                     </div>
//                     {/* Logo */}
//                     <NavLink to="/" className="text-xl font-bold">
//                         DeeCare
//                     </NavLink>
//
//                     {/* Desktop Menu */}
//                     <div className="hidden md:flex gap-3">
//                         <NavLink to="/" className="hover:text-amber-300">
//                             Home
//                         </NavLink>
//                         <NavLink to="/FindDoctor" className="hover:text-amber-300">
//                             Appointment
//                         </NavLink>
//                         <NavLink to="/Event" className="hover:text-amber-300">
//                             Event
//                         </NavLink>
//                         <NavLink to="/Login" className="hover:text-amber-300">
//                             Login
//                         </NavLink>
//
//                         {/*<button*/}
//                         {/*    onClick={() => setIsLoginOpen(true)}*/}
//                         {/*    className="hover:text-amber-300"*/}
//                         {/*>*/}
//                         {/*    Login*/}
//                         {/*</button>*/}
//                     </div>
//
//                     {/* Mobile Menu */}
//                     {menuOpen && (
//                         <div
//                             className="absolute top-[65px] left-0 w-full bg-white text-black border-t border-gray-200 md:hidden flex flex-col">
//                             <NavLink
//                                 to="/About"
//                                 className="py-3 px-4 hover:bg-gray-100"
//                                 onClick={() => setMenuOpen(false)}
//                             >
//                                 About
//                             </NavLink>
//                             <NavLink
//                                 to="/Privacy"
//                                 className="py-3 px-4 hover:bg-gray-100"
//                                 onClick={() => setMenuOpen(false)}
//                             >
//                                 Privacy Policy
//                             </NavLink>
//                             <NavLink
//                                 to="/Term"
//                                 className="py-3 px-4 hover:bg-gray-100"
//                                 onClick={() => setMenuOpen(false)}
//                             >
//                                 Terms of Service
//                             </NavLink>
//                         </div>
//                     )}
//                 </div>
//             </nav>
//             {isLoginOpen && <LoginOverlay onClose={() => setIsLoginOpen(false)}/>}
//             <Outlet/>
//         </>
//     );
// };
//
// export default NavBar;
