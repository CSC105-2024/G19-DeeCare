import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import * as z from "zod";
import {
    IconEye,
    IconEyeClosed
} from "@tabler/icons-react";

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

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
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

        try {
            // Validate form data using Zod
            loginSchema.parse(formData);

            // If validation passes, proceed with login
            setIsLoading(true);

            setTimeout(() => {
                if (onLogin) onLogin(formData);
                setIsLoading(false);
            }, 1000);

        } catch (error) {
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-opacity-40 z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-blue-100 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg w-11/12 sm:w-96 relative mx-4 sm:mx-auto">
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
                        <label htmlFor="idNumber" className="block text-pri text-sm font-semibold mb-1">
                            IDENTIFICATION NUMBER
                        </label>
                        <input
                            id="idNumber"
                            name="idNumber"
                            type="text"
                            value={formData.idNumber}
                            onChange={handleChange}
                            className="w-full p-2 mb-1 bg-background border border-gray-300 rounded-lg text-gray-500 outline-0"
                            placeholder="Enter your 13-digit ID"
                            maxLength={13}
                        />
                        {errors.idNumber && (
                            <p className="text-red-600 text-xs" aria-live="polite">{errors.idNumber}</p>
                        )}
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-pri text-sm font-semibold mb-1">
                            PASSWORD
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 mb-1 bg-background border border-gray-300 rounded-lg text-gray-500 outline-0"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <IconEye size={20}/> : <IconEyeClosed size={20}/>}
                            </button>
                        </div>
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
                            <span
                                className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        ) : null}
                        {isLoading ? "LOGGING IN..." : "LOGIN"}
                    </button>
                </form>

                <p className="text-center text-xs sm:text-sm text-blue-900 mt-4">
                    Don't have an account?
                    <span
                        onClick={handleRegisterClick}
                        className="text-yellow font-semibold cursor-pointer hover:underline ml-2"
                    >
                        REGISTER NOW
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginOverlay;