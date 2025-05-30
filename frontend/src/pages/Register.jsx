import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {cn} from "../lib/utils.js";
import {z} from "zod";
import {authAPI, authEvents} from "../api/authService.js";
import {
    IconEye,
    IconEyeClosed
} from "@tabler/icons-react";

const stepTitle = [
    'PATIENT INFORMATION',
    'EMERGENCY CONTACT',
];

const patientSchema = z.object({
    idNumber: z.string().length(13, "ID Number must be exactly 13 digits").regex(/^\d+$/, "ID Number must contain only digits"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    age: z.string().optional(),
    bloodType: z.string().min(1, "Blood type is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    email: z.string().email("Invalid email address"),
});

const emergencyContactSchema = z.object({
    contactName: z.string().optional(),
    relationship: z.string().optional(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
});

function Register() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formVisible, setFormVisible] = useState(true);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const [form, setForm] = useState({
        idNumber: "",
        firstName: "",
        lastName: "",
        dob: "",
        age: "",
        bloodType: "",
        password: "",
        email: "",
        contactName: "",
        contactPhone: "",
        relationship: "",
        contactEmail: "",
    });

    // Listen for registration success events
    useEffect(() => {
        const handleRegisterSuccess = (event) => {
            console.log('Registration success event received:', event.detail);
            setRegistrationSuccess(true);
            setFormVisible(false);
        };

        authEvents.onRegisterSuccess(handleRegisterSuccess);

        // Cleanup
        return () => {
            authEvents.removeListener('auth:register-success', handleRegisterSuccess);
        };
    }, []);

    // Check if user is already authenticated
    useEffect(() => {
        if (authAPI.isAuthenticated()) {
            navigate('/'); // Redirect to home if already logged in
        }
    }, [navigate]);

    const calculateAge = (dob) => {
        if (!dob) return "";
        const [year, month, day] = dob.split("-");
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age.toString();
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "idNumber") {
            const numericValue = value.replace(/\D/g, '');
            const truncatedValue = numericValue.slice(0, 13);
            setForm({...form, [name]: truncatedValue});
        } else if (name === "dob") {
            const ageValue = calculateAge(value);
            setForm({...form, [name]: value, age: ageValue});
        } else {
            setForm({...form, [name]: value});
        }

        // Clear error for this field when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: undefined
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateStep = (step) => {
        try {
            if (step === 1) {
                patientSchema.parse(form);
                return true;
            } else if (step === 2) {
                emergencyContactSchema.parse({
                    contactName: form.contactName,
                    relationship: form.relationship,
                    contactPhone: form.contactPhone,
                    contactEmail: form.contactEmail
                });
                return true;
            }
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.errors.forEach((err) => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const resetForm = () => {
        setForm({
            idNumber: "",
            firstName: "",
            lastName: "",
            dob: "",
            age: "",
            bloodType: "",
            password: "",
            email: "",
            contactName: "",
            contactPhone: "",
            relationship: "",
            contactEmail: "",
        });
        setCurrentStep(1);
        setErrors({});
        setRegistrationSuccess(false);
        setFormVisible(true);
    };

    const navigateToHomepage = () => {
        navigate('/');
    };

    const navigateToLogin = () => {
        navigate('/login'); // Or show login modal if you have one
    };

    const closeForm = () => {
        setFormVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateStep(currentStep)) {
            setIsSubmitting(true);
            setErrors({});

            try {
                // Prepare data for backend
                const userData = {
                    idNumber: form.idNumber,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    dob: form.dob,
                    age: parseInt(form.age),
                    bloodType: form.bloodType,
                    password: form.password,
                    email: form.email,
                };

                // Add emergency contact if provided
                if (form.contactName || form.relationship || form.contactPhone || form.contactEmail) {
                    userData.emergencyContact = {
                        contactName: form.contactName || null,
                        relationship: form.relationship || null,
                        contactPhone: form.contactPhone || null,
                        contactEmail: form.contactEmail || null,
                    };
                }

                console.log("Submitting registration data:", {...userData, password: '[HIDDEN]'});

                // Submit to backend using authAPI
                const response = await authAPI.register(userData);

                if (response.success) {
                    console.log('Registration successful:', response);
                    // The authAPI will automatically store the token and user data
                    // and dispatch the success event which we're listening for

                    // Show success message
                    alert("Registration successful! You are now logged in.");

                    // Navigate to home page or dashboard
                    navigate('/');
                } else {
                    // Handle validation errors from backend
                    setErrors({general: response.message || 'Registration failed'});
                }

            } catch (error) {
                console.error("Registration error:", error);

                // Handle different types of errors
                if (error.message) {
                    setErrors({general: error.message});

                    // If it's a duplicate email/ID error, go back to step 1
                    if (error.message.includes('email') ||
                        error.message.includes('ID number') ||
                        error.message.includes('already exists') ||
                        error.message.includes('already registered')) {
                        setCurrentStep(1);
                    }
                } else if (error.errors) {
                    // Handle field-specific errors if backend returns them
                    setErrors(error.errors);
                } else {
                    setErrors({general: 'An error occurred during registration. Please try again.'});
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const ErrorMessage = ({name}) => (
        errors[name] ? <p className="text-red-500 text-xs mt-1">{errors[name]}</p> : null
    );

    // If registration was successful but form is still visible, show success message
    if (registrationSuccess && !formVisible) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background p-4">
                <div className="bg-light-blue p-8 rounded-xl shadow-md max-w-md w-full text-center">
                    <div className="mb-4">
                        <div
                            className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-yellow mb-4">Welcome!</h2>
                    <p className="text-pri mb-6">Your registration was successful and you are now logged in.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={navigateToHomepage}
                            className="bg-pri text-white px-6 py-3 rounded-lg"
                        >
                            GO TO HOMEPAGE
                        </button>
                        <button
                            onClick={resetForm}
                            className="bg-white text-pri border border-pri px-6 py-3 rounded-lg"
                        >
                            REGISTER ANOTHER
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // If form is closed without success, show different message
    if (!formVisible && !registrationSuccess) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background p-4">
                <div className="bg-light-blue p-8 rounded-xl shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4">Registration Cancelled</h2>
                    <p className="text-pri mb-6">You can continue browsing or try registering again.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={navigateToHomepage}
                            className="bg-pri text-white px-6 py-3 rounded-lg"
                        >
                            BACK TO HOMEPAGE
                        </button>
                        <button
                            onClick={resetForm}
                            className="bg-white text-pri border border-pri px-6 py-3 rounded-lg"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-background p-4">
            <div className="bg-light-blue p-4 md:p-8 rounded-xl shadow-md max-w-3xl w-full">
                <h1 className="text-2xl mt-6 sm:text-4xl font-semibold text-blue-900 text-center mb-4">
                    REGISTER
                </h1>

                {/* General error message */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"/>
                            </svg>
                            {errors.general}
                        </div>
                    </div>
                )}

                {/* Progress bar / steps */}
                <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto">
                    <div className="flex flex-row justify-center items-center gap-2 sm:gap-4 relative z-10 w-fit">
                        <div className="bg-pri w-1/2 h-1 absolute top-[30%] rounded -z-10"></div>
                        {stepTitle.map((title, index) => (
                            <div key={index + 1}
                                 className="flex flex-col items-center justify-center md:text-2xl relative px-1">
                                <div className={cn(
                                    "flex items-center justify-center text-white rounded-full size-16 sm:size-14 md:size-18",
                                    currentStep >= index + 1 ? "bg-ivory border-2 border-pri text-pri" : "bg-gray-400 border-2 border-gray-400",
                                )}>
                                    {index + 1}
                                </div>
                                <span className={cn(
                                    "font-medium text-xs md:text-lg text-center",
                                    currentStep >= index + 1 ? "text-pri font-semibold mt-2 sm:mt-4" : "text-gray-400 mt-2 sm:mt-4",
                                )}>{title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {/* Step 1: Patient Information */}
                    <div className={currentStep === 1 ? "block" : "hidden"}>
                        <div className="">
                            <h2 className="text-xl mb-4 font-bold text-blue-900 ">
                                PATIENT INFORMATION
                            </h2>
                        </div>

                        {/* ID Number */}
                        <div>
                            <label className="block font-semibold text-lg text-pri mb-1">
                                IDENTIFICATION NUMBER <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="idNumber"
                                value={form.idNumber}
                                onChange={handleChange}
                                placeholder="ENTER YOUR IDENTIFICATION NUMBER (13 DIGITS)"
                                className={`w-full p-3 rounded-md bg-gray-50 border ${errors.idNumber ? 'border-red-500' : 'border-blue-100'} placeholder-gray-500 outline-0`}
                                inputMode="numeric"
                                maxLength={13}
                            />
                            <ErrorMessage name="idNumber"/>
                            {form.idNumber && form.idNumber.length !== 13 && !errors.idNumber && (
                                <p className="text-yellow-600 text-xs mt-1">ID Number must be exactly 13 digits
                                    ({form.idNumber.length}/13)</p>
                            )}
                        </div>

                        {/* First & Last Name */}
                        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-4">
                            <div className="w-full ">
                                <label className="block font-semibold text-lg text-pri mb-1 mt-2">
                                    FIRST NAME <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="ENTER YOUR FIRST NAME"
                                    className={`w-full p-3 rounded-md bg-gray-50 border ${errors.firstName ? 'border-red-500' : 'border-blue-100'} placeholder-gray-500 outline-0`}
                                />
                                <ErrorMessage name="firstName"/>
                            </div>
                            <div className="w-full">
                                <label className="block font-semibold text-lg text-pri mb-1 mt-2">
                                    LAST NAME <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="ENTER YOUR LAST NAME"
                                    className={`w-full p-3 rounded-md bg-gray-50 border ${errors.lastName ? 'border-red-500' : 'border-blue-100'} placeholder-gray-500 outline-0`}
                                />
                                <ErrorMessage name="lastName"/>
                            </div>
                        </div>

                        {/* DOB + Age + Blood Type */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="col-span-2">
                                <label className="block font-semibold text-lg text-pri mb-1 mt-2">
                                    BIRTH DATE <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={form.dob}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-md bg-gray-50 border ${errors.dob ? 'border-red-500' : 'border-blue-100'} text-gray-700 outline-0`}
                                />
                                <ErrorMessage name="dob"/>
                            </div>
                            <div className="md:mt-3">
                                <label className="block font-semibold text-lg text-pri ">
                                    AGE <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="age"
                                    value={form.age}
                                    readOnly
                                    placeholder="AGE"
                                    className="w-full p-3 rounded-md bg-gray-50 border-blue-100 text-gray-700 outline-0"
                                />
                            </div>
                            <div className="md:mt-3">
                                <label className="block font-semibold text-lg text-pri">
                                    BLOOD TYPE <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="bloodType"
                                    value={form.bloodType}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-md bg-gray-50 border ${errors.bloodType ? 'border-red-500' : 'border-blue-100'} text-gray-500 outline-0`}
                                >
                                    <option value="">SELECT</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="O">O</option>
                                    <option value="AB">AB</option>
                                </select>
                                <ErrorMessage name="bloodType"/>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="">
                            <label className="block font-semibold text-lg text-pri mb-1 mt-2">
                                EMAIL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="ENTER YOUR EMAIL"
                                className={`w-full p-3 rounded-md bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-blue-100'} placeholder-gray-500 outline-0`}
                            />
                            <ErrorMessage name="email"/>
                        </div>

                        {/* Password with toggle button */}
                        <div>
                            <label className="block font-semibold text-lg text-pri mb-1 mt-2">
                                PASSWORD <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="ENTER YOUR PASSWORD"
                                    className={`w-full p-3 rounded-md bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-blue-100'} placeholder-gray-500 outline-0`}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <IconEye/> : <IconEyeClosed/>}
                                </button>
                            </div>
                            <ErrorMessage name="password"/>
                        </div>
                        <div className="flex flex-row justify-end mt-6 gap-3">
                            <button
                                type="button"
                                className="btn bg-pri text-background px-6 py-6 rounded-lg text-sm sm:text-base"
                                onClick={handleNextStep}
                            >
                                Next Step
                            </button>
                        </div>
                    </div>

                    {/* Step 2: Emergency Contact */}
                    <div className={currentStep === 2 ? "block" : "hidden"}>
                        <div className="">
                            <h2 className="text-xl mb-4 font-bold text-blue-900 ">
                                Emergency Contact (Optional)
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                This information helps us contact someone in case of emergency. You can skip this step
                                if needed.
                            </p>
                        </div>
                        <div className="w-full">
                            {/* Name */}
                            <label className="block font-semibold text-lg text-pri mb-1 mt-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="contactName"
                                value={form.contactName}
                                onChange={handleChange}
                                placeholder="Enter Contact Name"
                                className={`w-full p-3 rounded-md bg-gray-50 border ${errors.contactName ? 'border-red-500' : 'border-blue-100'} text-gray-500 outline-0`}
                            />
                            <ErrorMessage name="contactName"/>

                            {/* Relationship */}
                            <label className="block font-semibold text-lg text-pri mb-1 mt-2">
                                Relationship to the patient
                            </label>
                            <input
                                type="text"
                                name="relationship"
                                value={form.relationship}
                                onChange={handleChange}
                                placeholder="Enter Relationship"
                                className={`w-full p-3 rounded-md bg-gray-50 border ${errors.relationship ? 'border-red-500' : 'border-blue-100'} text-gray-500 outline-0`}
                            />
                            <ErrorMessage name="relationship"/>

                            {/* Phone number */}
                            <label className="block font-semibold text-lg text-pri mb-1 mt-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={form.contactPhone}
                                onChange={handleChange}
                                placeholder="Enter Phone Number"
                                className={`w-full p-3 rounded-md bg-gray-50 border ${errors.contactPhone ? 'border-red-500' : 'border-blue-100'} text-gray-500 outline-0`}
                            />
                            <ErrorMessage name="contactPhone"/>

                            {/* Email */}
                            <label className="block font-semibold text-lg text-pri mb-1 mt-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={form.contactEmail}
                                onChange={handleChange}
                                placeholder="Enter Email"
                                className={`w-full p-3 rounded-md bg-gray-50 border ${errors.contactEmail ? 'border-red-500' : 'border-blue-100'} text-gray-500 outline-0`}
                            />
                            <ErrorMessage name="contactEmail"/>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3 sm:gap-4">
                            <button
                                type="button"
                                className="btn bg-background text-pri border border-pri w-full sm:w-auto px-6 py-3 rounded-md text-sm sm:text-base"
                                onClick={handlePreviousStep}
                            >
                                Previous Step
                            </button>
                            <button
                                type="submit"
                                className={`btn ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow hover:bg-yellow-600'} text-background w-full sm:w-auto px-6 py-3 rounded-md text-sm sm:text-base transition-colors`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </div>
                                ) : "Create Account"}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Login Link */}
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={navigateToLogin}
                            className="text-pri hover:text-blue-800 font-medium underline"
                        >
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;