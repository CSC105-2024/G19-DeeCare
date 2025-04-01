import React from "react";


const LoginOverlay=({ onClose })=>{
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-blue-100 p-8 rounded-2xl shadow-lg w-96 relative">
                <button
                    className="absolute top-6 right-6 m bg-red-700 text-red-50 "
                    onClick={onClose}>
                    ✕
                </button>
                <h2 className="text-2xl font-extrabold text-center text-blue-900 mb-6">LOGIN</h2>

                <label className="block text-blue-900 text-sm font-semibold mb-2">IDENTIFICATION NUMBER</label>
                <input
                    type="text"
                    className="w-full p-2 mb-2 bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your ID"
                />

                <label className="block text-blue-900 text-sm font-semibold mb-2">PASSWORD</label>
                <input
                    type="password"
                    className="w-full p-2 mb-4 border bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                />

                <button className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900">LOGIN</button>

                <p className="text-center text-sm text-blue-900 mt-4">
                    Don't have an account? <span className="text-amber-500 font-semibold cursor-pointer hover:underline">REGISTER NOW</span>
                </p>
            </div>
        </div>
    );
}

export default LoginOverlay;