import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import {
    IconEye,
    IconEyeClosed
} from "@tabler/icons-react";

const loginSchema = z.object({
    id: z.string().min(1, "ID is required").max(50),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const LoginOverlay = ({ onClose, onLogin }) => {
    const [formData, setFormData] = useState({
        id: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const validatedData = loginSchema.parse(formData);
            console.log("Form is valid:", validatedData);

            setTimeout(() => {
                if (onLogin) onLogin(validatedData);
                setIsLoading(false);
            }, 1000);

        } catch (error) {
            setIsLoading(false);
            if (error instanceof z.ZodError) {
                // Convert Zod errors to a more usable format
                const formattedErrors = {};
                error.errors.forEach((err) => {
                    const path = err.path[0];
                    formattedErrors[path] = err.message;
                });
                setErrors(formattedErrors);
            } else {
                console.error("Unexpected error during login:", error);
            }
        }
    };

    const handleRegisterClick = () => {
        onClose();
        navigate("/register");
    };

    // Prevent background scrolling when overlay is open
    React.useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Close overlay when clicking outside and on ESC key
    React.useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscKey);
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [onClose]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-opacity-40 z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-blue-100 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg w-11/12 sm:w-96 relative mx-4 sm:mx-auto">
                <button
                    className="absolute top-4 right-4 md:top-6 md:right-6 py-1 px-2.5 rounded-full text-pri text-2xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>
                <h2 className="text-2xl sm:text-2xl font-extrabold text-center text-pri mb-4 sm:mb-6">LOGIN</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="id" className="block text-pri text-sm font-semibold mb-1">
                            IDENTIFICATION NUMBER
                        </label>
                        <input
                            id="id"
                            name="id"
                            type="text"
                            value={formData.id}
                            onChange={handleChange}
                            className="w-full p-2 mb-1 bg-background border border-gray-300 rounded-lg text-gray-500 outline-0"
                            placeholder="Enter your ID"
                        />
                        {errors.id && (
                            <p className="text-red-600 text-xs" aria-live="polite">{errors.id}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-pri text-sm font-semibold mb-1">
                            PASSWORD
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 mb-1 bg-background border border-gray-300 rounded-lg text-gray-500 outline-0"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-600 text-xs" aria-live="polite">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        aria-busy={isLoading}
                        className="w-full bg-pri text-background py-2 rounded-lg hover:bg-primary-900 flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        ) : null}
                        {isLoading ? "LOGGING IN..." : "LOGIN"}
                    </button>
                </form>

                <p className="text-center text-xs sm:text-sm text-blue-900 mt-4">
                    Don't have an account?
                    <span
                        onClick={handleRegisterClick}
                        className="text-yellow font-semibold cursor-pointer hover:underline ml-1"
                    >
                        REGISTER NOW
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginOverlay;