import {useState} from "react";
import {cn} from "../lib/utils.js";
import {z} from "zod";
import {
    IconEye,
    IconEyeClosed
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

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
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formVisible, setFormVisible] = useState(true);

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
    };

    const navigateToHomepage = () => {
        // Choose one of these approaches based on your routing setup:

        // 1. If you're using FormContext for navigation:
        if (setPage) {
            setPage('home'); // Navigate to home page using context
            return;
        }

        // 2. For React Router:
        // navigate('/'); // Navigate to home page

        // 3. For Next.js:
        // router.push('/'); // Navigate to home page

        // 4. For plain HTML navigation:
        window.location.href = '/'; // Navigate to home page
    };

    const closeForm = () => {
        setFormVisible(false);
        // We'll keep this separate from navigation for clarity
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateStep(currentStep)) {
            setIsSubmitting(true);
            try {
                // Simulate sending to backend
                console.log("Submitting form data:", form);

                // Use a custom alert with a callback for the OK button
                const confirmed = window.confirm("Registration successfully submitted!");

                // When user clicks OK on the alert, close the form
                if (confirmed) {
                    closeForm();
                }

            } catch (error) {
                console.error("Error submitting form:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const ErrorMessage = ({name}) => (
        errors[name] ? <p className="text-red-500 text-xs mt-1">{errors[name]}</p> : null
    );

    // If form is closed, show a success message or redirect
    if (!formVisible) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background p-4">
                <div className="bg-light-blue p-8 rounded-xl shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-yellow mb-4">Registration Complete!</h2>
                    <p className="text-pri mb-6">Your registration was successfully submitted.</p>
                    <button
                        onClick={navigateToHomepage}
                        className="bg-pri text-white px-6 py-3 rounded-lg mx-auto"
                    >
                        BACK TO HOMEPAGE
                    </button>
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
                                Emergency Contact
                            </h2>
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
                                className="btn bg-yellow text-background w-full sm:w-auto px-6 py-3 rounded-md text-sm sm:text-base"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;