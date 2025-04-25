import React from "react";
import { Link } from "react-router-dom";

const LoginOverlay=({ onClose })=>{
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-blue-100 p-8 rounded-2xl shadow-lg w-96 relative">
                <button
                    className="absolute top-6 right-6 py-1 px-2.5 rounded-full bg-red-800 text-white hover:bg-red-600 "
                    onClick={onClose}>
                    ✕
                </button>
                <h2 className="text-2xl font-extrabold text-center text-pri mb-6">LOGIN</h2>

                <label className="block text-pri text-sm font-semibold mb-2">IDENTIFICATION NUMBER</label>
                <input
                    type="text"
                    className="w-full p-2 mb-2 bg-background border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your ID"
                />

                <label className="text-pri text-sm font-semibold mb-2">PASSWORD</label>
                <input
                    type="password"
                    className="w-full p-2 mb-4 border bg-background border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your password"
                />

                <button className="w-full bg-pri text-background py-2 rounded-lg hover:bg-primary-900">LOGIN</button> 
                    <p className="text-center text-sm text-blue-900 mt-4">
                        Don't have an account? 
                    <Link to="/Register">
                    <span className="text-amber-500 font-semibold cursor-pointer hover:underline"> REGISTER NOW</span>
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginOverlay;
