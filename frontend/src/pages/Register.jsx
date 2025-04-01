import { useState } from "react";

export default function Register() {
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
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age > 0 ? age : "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prevForm) => {
            const updatedForm = { ...prevForm, [name]: value };

            if (name === "dob") {
                updatedForm.age = calculateAge(value);
            }

            return updatedForm;
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-20 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold text-center mb-6">REGISTER</h2>
                {/*<div className="flex justify-center space-x-4 mb-6">*/}
                {/*    <div className="flex items-center">*/}
                {/*        <div className="w-6 h-6 flex justify-center items-center bg-blue-600 text-white rounded-full">1</div>*/}
                {/*        <span className="ml-2 font-semibold">Patient Info</span>*/}
                {/*    </div>*/}
                {/*    <div className="w-16 h-px bg-gray-400 mt-3"></div>*/}
                {/*    <div className="flex items-center text-gray-400">*/}
                {/*        <div className="w-6 h-6 flex justify-center items-center bg-gray-300 text-white rounded-full">2</div>*/}
                {/*        <span className="ml-2">Emergency Contact</span>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="space-y-4">
                    <input type="text" name="idNumber" placeholder="Identification Number" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                    <input type="text" name="firstName" placeholder="First Name" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                    <input type="text" name="lastName" placeholder="Last Name" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                    <div className="flex space-x-2">
                        <input type="date" name="dob" className="w-1/2 p-3 border rounded-lg" onChange={handleChange} />
                        <input type="text" name="age" value={form.age} placeholder="Age" className="w-1/4 p-3 border rounded-lg bg-gray-200" readOnly />
                        <select name="bloodType" className="w-1/4 p-3 border rounded-lg" onChange={handleChange}>
                            <option value="">Blood Type</option>
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
                    <input type="password" name="password" placeholder="Password" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={handleChange} />
                    <div className="flex space-x-4 mt-4">
                        <button className="w-1/2 bg-blue-600 text-white py-2 rounded-lg">Continue</button>
                        <button className="w-1/2 bg-gray-800 text-white py-2 rounded-lg">Skip</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
