import {Link} from "react-router-dom";

const Confirm = () => {
    return (
        <>
            <div>
                {/*<div className="text-4xl">Confirm page</div>*/}
                {/*<div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>*/}
                {/*    <button>*/}
                {/*        <Link to="/Login">Confirm Appointment</Link>*/}
                {/*    </button>*/}
                {/*</div>*/}
                {/*<div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>*/}
                {/*    <button>*/}
                {/*        <Link to="/Timeslot"> back </Link>*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
                <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6 md:p-8">
                    <h2 className="text-lg md:text-xl font-bold text-center text-blue-700">
                        APPOINTMENT CONFIRMED
                    </h2>
                    <p className="text-center text-gray-600 text-sm md:text-base">
                        YOUR APPOINTMENT IS SCHEDULED FOR
                    </p>

                    <div className="mt-4 bg-blue-100 p-4 rounded-lg flex flex-col md:flex-row items-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                        <div className="ml-0 md:ml-4 flex-1 text-center md:text-left">
                            <p className="font-bold">DOCTOR: Mr. Good Doctor</p>
                            <p className="text-sm text-gray-600">DEPARTMENT: General Health</p>
                        </div>
                        <div className="text-center md:text-right text-sm mt-2 md:mt-0">
                            <p className="font-bold">TIME</p>
                            <p>8:00 - 9:00</p>
                        </div>
                    </div>

                    <div className="mt-4 bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row items-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                        <div className="ml-0 md:ml-4 flex-1 text-center md:text-left">
                            <p className="font-bold">PATIENT:</p>
                            <p className="text-sm text-gray-600">NAME: [Your Name]</p>
                            <p className="text-sm text-gray-600">SYMPTOM: [Symptom Details]</p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center md:justify-start">
                        <input type="checkbox" className="mr-2"/>
                        <label className="text-sm text-gray-600">Send notification via email</label>
                    </div>

                    <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        <Link to="/Login">CONFIRM</Link>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Confirm;