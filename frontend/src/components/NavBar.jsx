import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <nav className='bg-primary text-white fixed top-0 w-full z-50'>
                <div className='container mx-auto flex justify-between items-center h-[65px] px-4'>

                    {/* Hamburger Icon */}
                    <div className='md:hidden' onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? (
                            <span className="text-2xl">✕</span>
                        ) : (
                            <span className="text-2xl">☰</span>
                        )}
                    </div>

                    {/* Logo */}
                    <NavLink to="/Home" className='text-xl font-bold'>
                        DeeCare
                    </NavLink>

                    {/* Desktop Menu */}
                    <div className='hidden md:flex gap-3'>
                        <NavLink to="/Home" className='hover:text-amber-300'>Home</NavLink>
                        <NavLink to="/FindDoctor" className='hover:text-amber-300'>Appointment</NavLink>
                        <NavLink to="/Event" className='hover:text-amber-300'>Event</NavLink>
                        <NavLink to="/Login" className='hover:text-amber-300'>Login</NavLink>
                    </div>

                    {/* Mobile Menu */}
                    {menuOpen && (
                        <div className="absolute top-[65px] left-0 w-full bg-white text-black border-t border-gray-200 md:hidden flex flex-col">
                            <NavLink to="/About" className='py-3 px-4 hover:bg-gray-100' onClick={() => setMenuOpen(false)}>About</NavLink>
                            <NavLink to="/Privacy" className='py-3 px-4 hover:bg-gray-100' onClick={() => setMenuOpen(false)}>Privacy Policy</NavLink>
                            <NavLink to="/Term" className='py-3 px-4 hover:bg-gray-100' onClick={() => setMenuOpen(false)}>Terms of Service</NavLink>
                        </div>
                    )}
                </div>
            </nav>
            <Outlet />
        </>
    );
};

export default NavBar;
