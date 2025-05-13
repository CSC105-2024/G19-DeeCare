import {useNavigate, useLocation} from "react-router-dom";
import {useState} from "react";
import {format} from 'date-fns';

function ConfirmAppointment() {
    const navigate = useNavigate();
    const location = useLocation();
    const {appointmentDetails} = location.state || {};

    const [sendEmailNotification, setSendEmailNotification] = useState(true);

    // If no appointment details were passed, redirect back to timeslot selection
    if (!appointmentDetails) {
        navigate("/Timeslot");
        return null;
    }

    const {doctorInfo, selectedDate, selectedTimeSlot} = appointmentDetails;

    // Format the appointment time for display
    const startTime = selectedTimeSlot.start.includes('T')
        ? selectedTimeSlot.start.split('T')[1].substring(0, 5)
        : selectedTimeSlot.start.split(' ')[1].substring(0, 5);

    const endTime = selectedTimeSlot.end.includes('T')
        ? selectedTimeSlot.end.split('T')[1].substring(0, 5)
        : selectedTimeSlot.end.split(' ')[1].substring(0, 5);

    const formattedDate = format(selectedDate, 'MMMM d, yyyy');

    const handleFinalConfirm = () => {
        // Save notification preference if needed
        localStorage.setItem('sendEmailNotification', sendEmailNotification);
        alert('Appointment Confirmed Successfully');
        navigate("/userdetail", {
            state: {
                appointmentDetails: {
                    ...appointmentDetails,
                    sendEmailNotification
                }
            }
        });
    };

    return (
        <div className="px-4 md:px-0">
            <div className="max-w-2xl mx-auto mt-8 mb-8 p-6 bg-light-blue rounded-xl">
                <div className="max-w-2xl mx-auto mt-8 mb-8 p-6 bg-light-blue rounded-xl ">
                    <h1 className="text-3xl font-bold text-center text-pri mt-4 mb-6">APPOINTMENT CONFIRMED</h1>
                    <p className="text-center mb-4 text-pri text-lg">
                        YOUR APPOINTMENT IS SCHEDULED FOR<br/>
                        <span className="font-bold">{formattedDate}</span>
                    </p>

                    <div className="bg-ivory rounded-xl p-4 mb-4 text-pri flex items-center border-1 border-pri">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 mr-4">
                            {doctorInfo.image ? (
                                <img src={doctorInfo.image} alt={doctorInfo.name}
                                     className="w-full h-full rounded-full object-cover"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <p><span className="font-semibold">DOCTOR:</span> {doctorInfo.name}</p>
                            <p><span className="font-semibold">DEPARTMENT:</span> {doctorInfo.department}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">TIME</p>
                            <p className="font-semibold">AT</p>
                            <p>{startTime} - {endTime}</p>
                        </div>
                    </div>

                    <div className="bg-background rounded-xl p-4 mb-4 text-pri flex items-center border-1 border-pri">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 mr-4">
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <p><span className="font-semibold">PATIENT</span></p>
                                <p><span className="font-semibold">NAME:</span></p>
                                <p><span className="font-semibold">SYMPTOM:</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Email notification toggle */}
                    <div className="flex items-center justify-between text-pri  bg-light-blue rounded-lg mb-0">
                        <div className="flex-grow">
                            <p className="font-semibold">Send notification via email</p>
                        </div>
                        <div>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sendEmailNotification}
                                    onChange={() => setSendEmailNotification(!sendEmailNotification)}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200
                        peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pri rounded-full peer peer-checked:after:translate-x-full
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300
                        after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pri"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleFinalConfirm}
                            className="px-12 py-2 bg-yellow hover:bg-yellow-600 text-background font-semibold rounded-lg"
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmAppointment;
