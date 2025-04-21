import {createContext, useState, useEffect} from "react";
import {useContext} from "react";

const FormContext = createContext({})

export const FormProvider = ({children}) => {
    const title = {
        0: 'PATIENT INFORMATION',
        1: 'EMERGENCY CONTACT',
    }
    const [page, setPage] = useState(0)

    const [form, setForm] = useState({
        idNumber: "",
        firstName: "",
        lastName: "",
        dob: "",
        age: "",
        bloodType: "",
        password: "",
        email: "",
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
    const [currentStep, setCurrentStep] = useState(1);

    return (
        <div>
            {/* Form Section */
            }
            <h3 className="text-xl font-bold text-blue-900 mb-4">
                PATIENT INFORMATION
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">

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
                        <label className="block font-semibold text-sm text-blue-900 mb-1">
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
                        <label className="block font-semibold text-sm text-blue-900 mb-1">
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
                        <label className="block font-semibold text-sm text-blue-900 mb-1">
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
                        <label className="block font-semibold text-sm text-blue-900 mb-1">
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
                        <label className="block font-semibold text-sm text-blue-900 mb-1">
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
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block font-semibold text-sm text-blue-900 mb-1">
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
                    <label className="block font-semibold text-sm text-blue-900 mb-1">
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

                {/* Button */}
                <div className="pt-2">
                    <outlet/>
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-4 rounded-md transition-colors"
                    >
                        CONTINUE
                    </button>
                </div>
            </form>
            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                    Back
                </button>
                <button
                    onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 4))}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export const useFormContext = () => useContext(FormContext);
