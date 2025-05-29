import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import * as z from "zod";
import {IconEye, IconEyeClosed} from "@tabler/icons-react";
import {authAPI} from '../api/authService';

const loginSchema = z.object({
    idNumber: z.string().length(13, "ID Number must be exactly 13 digits").regex(/^\d+$/, "ID Number must contain only digits"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const LoginOverlay = ({onClose, onLogin}) => {
    const [formData, setFormData] = useState({
        idNumber: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;

        // For ID number, only allow digits and limit to 13 characters
        if (name === 'idNumber') {
            const numericValue = value.replace(/\D/g, '');
            const truncatedValue = numericValue.slice(0, 13);
            setFormData((prev) => ({
                ...prev,
                [name]: truncatedValue
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear field-specific errors when user types
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }));
        }

        // Clear API error when user makes changes
        if (apiError) {
            setApiError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        try {
            // Validate form data
            loginSchema.parse(formData);
            setErrors({});

            setIsLoading(true);

            // Call the enhanced auth API
            const response = await authAPI.login({
                idNumber: formData.idNumber,
                password: formData.password
            });

            if (response.success) {
                // The authAPI already stores the token and user data
                if (onLogin) {
                    onLogin({
                        user: response.user,
                        token: response.token
                    });
                }

                // Close the overlay
                onClose();

                // Optional: Show success message
                console.log('Login successful for:', response.user?.firstName);
            } else {
                setApiError(response.message || "Login failed");
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation errors
                const formattedErrors = {};
                error.errors.forEach((err) => {
                    const path = err.path[0];
                    formattedErrors[path] = err.message;
                });
                setErrors(formattedErrors);
            } else {
                // Handle API errors (these come from the enhanced authAPI)
                console.error("Login error:", error);
                setApiError(error.message || "An error occurred during login. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterClick = () => {
        onClose();
        navigate("/register");
    };

    // Handle keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "Enter" && e.ctrlKey) {
                // Ctrl+Enter to submit form
                handleSubmit(e);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Prevent body scroll when overlay is open
    React.useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-black/40 z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-blue-100 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl w-11/12 sm:w-96 relative mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-4 right-4 md:top-6 md:right-6 py-1 px-2.5 rounded-full text-red-600 text-2xl hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
                    onClick={onClose}
                    aria-label="Close login overlay"
                    disabled={isLoading}
                >
                    ✕
                </button>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-900 mb-4 sm:mb-6">
                    LOGIN
                </h2>

                {apiError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        <div className="flex">
                            <span className="text-red-500 mr-2">⚠️</span>
                            <span>{apiError}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label htmlFor="idNumber" className="block text-blue-900 text-sm font-semibold mb-2">
                            IDENTIFICATION NUMBER
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            id="idNumber"
                            name="idNumber"
                            type="text"
                            value={formData.idNumber}
                            onChange={handleChange}
                            className={`w-full p-3 mb-1 bg-white border-2 ${
                                errors.idNumber ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                            } rounded-lg text-gray-700 outline-none transition-colors`}
                            placeholder="Enter your 13-digit ID"
                            maxLength={13}
                            disabled={isLoading}
                            inputMode="numeric"
                            autoComplete="username"
                        />
                        {errors.idNumber && (
                            <p className="text-red-600 text-xs mt-1" role="alert">
                                {errors.idNumber}
                            </p>
                        )}
                        {formData.idNumber && formData.idNumber.length !== 13 && !errors.idNumber && (
                            <p className="text-amber-600 text-xs mt-1">
                                ID Number: {formData.idNumber.length}/13 digits
                            </p>
                        )}
                    </div>

                    <div className="mb-6 relative">
                        <label htmlFor="password" className="block text-blue-900 text-sm font-semibold mb-2">
                            PASSWORD
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full p-3 pr-12 mb-1 bg-white border-2 ${
                                    errors.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                } rounded-lg text-gray-700 outline-none transition-colors`}
                                placeholder="Enter your password"
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-blue-500 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                disabled={isLoading}
                                tabIndex={-1}
                            >
                                {showPassword ? <IconEye size={20}/> : <IconEyeClosed size={20}/>}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-600 text-xs mt-1" role="alert">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !formData.idNumber || !formData.password}
                        className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center font-semibold transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <span
                                    className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                LOGGING IN...
                            </>
                        ) : (
                            "LOGIN"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-blue-800">
                        Don't have an account?{" "}
                        <button
                            onClick={handleRegisterClick}
                            className="text-yellow-600 font-semibold hover:text-yellow-700 hover:underline focus:outline-none focus:underline transition-colors"
                            disabled={isLoading}
                        >
                            REGISTER NOW
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginOverlay;