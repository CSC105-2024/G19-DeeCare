import ProgressBar from "../components/ProgressBar.jsx";
import { useFormContext } from "../context/FormContext"; // adjust path if needed


function Register() {
    const { page } = useFormContext();

    return (
        <div className="flex justify-center items-center min-h-screen bg-white mt-24 p-4">
            <div className="bg-blue-100 p-8 rounded-xl shadow-md max-w-3xl w-full">
                <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-6">
                    REGISTER
                </h2>
                <ProgressBar/>
                <FormContext/>
            </div>
        </div>
    )
}

export default Register;