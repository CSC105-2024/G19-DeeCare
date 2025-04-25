import ProgressBar from "../components/ProgressBar.jsx";
import {useFormContext} from "../context/FormContext";
import {useState} from "react";
import {cn} from "../lib/utils.js"; // adjust path if needed

const stepTitle = [
    'PATIENT INFORMATION',
    'EMERGENCY CONTACT',
];

function Register() {
    const {page} = useFormContext();
    const [currentStep, setCurrentStep] = useState(1);

    const [form, setForm] = useState({
        idNumber: "",
        firstName: "",
        lastName: "",
        dob: "",
        age: "",
        bloodType: "",
        password: "",
        email: "",
        ConName: "",
        phoneNumber: "",
        Relationship: "",
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
        return age;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        let updatedForm = {...form, [name]: value};
        if (name === "dob") {
            updatedForm.age = calculateAge(value);
        }
        setForm(updatedForm);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // handle sending to backend here
        console.log(form);
    };

    return (<div className="flex justify-center items-center min-h-screen bg-background p-4">
        <div className="bg-light-blue p-8 rounded-xl shadow-md max-w-3xl w-full">
            <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-6">
                REGISTER
            </h2>
            {/*<ProgressBar />*/}
            {/*<FormContext/>*/}

            <div className="flex items-center justify-center mb-8">
                <div className="flex flex-row justify-center items-center gap-4 relative z-10 w-fit">
                    <div className="bg-pri w-full h-1 absolute top-[35%] rounded -z-10"></div>
                    {stepTitle.map((title, index) => (
                        <div key={index + 1} className="flex flex-col items-center justify-center relative">
                            <div className={cn(
                                "flex items-center justify-center text-white rounded-full size-12",
                                currentStep >= index + 1 ? "bg-ivory border-2 border-pri text-pri" : "bg-gray-500"
                            )}>
                                {index + 1}
                            </div>
                            <span className={cn(
                                "font-medium text-sm",
                                currentStep >= index + 1 ? "text-pri font-semibold mt-4" : null,
                            )}>{title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className={currentStep === 1 ? "block" : "hidden"}>
                    {/* Form Section */
                    }
                    <div className="">
                        <h3 className="text-xl font-bold text-blue-900 mb-4">
                            PATIENT INFORMATION
                        </h3>
                    </div>

                    {/* ID Number */}
                    <div>
                        <label className="block font-semibold text-sm text-blue-900 mb-1">
                            IDENTIFICATION NUMBER <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="idNumber"
                            value={form.idNumber}
                            onChange={handleChange}
                            placeholder="ENTER YOUR IDENTIFICATION NUMBER"
                            className="w-full p-3 rounded-md bg-gray-50 border border-blue-100 placeholder-gray-500"
                            required
                        />
                    </div>

                    {/* First & Last Name */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <label className="block font-semibold text-sm text-pri mb-1 mt-2">
                                FIRST NAME <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="ENTER YOUR FIRST NAME"
                                className="w-full p-3 rounded-md bg-gray-50 border border-blue-100 placeholder-gray-500"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label className="block font-semibold text-sm text-pri mb-1 mt-2">
                                LAST NAME <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="ENTER YOUR LAST NAME"
                                className="w-full p-3 rounded-md bg-gray-50 border border-blue-100 placeholder-gray-500"
                                required
                            />
                        </div>
                    </div>

                    {/* DOB + Age + Blood Type */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2">
                            <label className="block font-semibold text-sm text-pri mb-1 mt-2">
                                BIRTH DATE <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="dob"
                                value={form.dob}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded-md bg-gray-50 border border-blue-100 text-gray-700"
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="block font-semibold text-sm text-pri mb-1 mt-2">
                                AGE <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="age"
                                value={form.age}
                                readOnly
                                placeholder="AGE"
                                className="w-full p-2.5 rounded-md bg-gray-50 border border-blue-100 text-gray-700"
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="block font-semibold text-sm text-pri mb-1 mt-2">
                                BLOOD TYPE <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="bloodType"
                                value={form.bloodType}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded-md bg-gray-50 border border-blue-100 text-gray-700"
                                required
                            >
                                <option value="">BLOOD TYPE</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="O">O</option>
                                <option value="AB">AB</option>
                            </select>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="">
                        <label
                            className="block font-semibold text-sm text-pri mb-1 mt-2"
                        >
                            EMAIL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="ENTER YOUR EMAIL"
                            className="w-full p-3 rounded-md bg-gray-50 border border-blue-100 placeholder-gray-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            className="block font-semibold text-sm text-pri mb-1 mt-2"
                        >
                            PASSWORD <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="ENTER YOUR PASSWORD"
                            className="w-full p-3 rounded-md bg-gray-50 border border-blue-100 placeholder-gray-500"
                            required
                        />
                    </div>

                </div>
                <div className={currentStep === 2 ? "block" : "hidden"}>
                    <h3 className="text-xl font-bold text-blue-900 mb-4"
                    >
                        Emergency Contact
                    </h3>
                    <div className="w-full">
                        <label
                            className="block font-semibold text-sm text-primary mb-1 mt-2"
                        >
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="text"
                        name="name"
                        value={form.name}/>
                    </div>


                </div>
            </form>
            <div className="flex flex-row justify-end gap-4">
                <button
                    className="btn bg-pri "
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    disabled={currentStep === 1}
                >
                    Previous Step
                </button>
                <button
                    className="btn bg-pri text-background"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={currentStep === 2}
                >
                    Next Step
                </button>
            </div>

        </div>
    </div>)
}

export default Register;