import {useState, useEffect} from "react";
import {format} from 'date-fns';

function ConfirmAppointmentOverlay({appointmentDetails, onClose, onConfirm}) {
    const [sendEmailNotification, setSendEmailNotification] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);

        return () => clearTimeout(timer);
    }, []);


    if (!appointmentDetails) {
        return null;
    }

    const {doctorInfo, selectedDate, selectedTimeSlot} = appointmentDetails;

    let startTime, endTime;

    if (typeof selectedTimeSlot.start === 'string' && selectedTimeSlot.start.includes(':') && !selectedTimeSlot.start.includes('T')) {

        startTime = selectedTimeSlot.start;
        endTime = selectedTimeSlot.end;
    } else {

        startTime = selectedTimeSlot.start.includes('T')
            ? selectedTimeSlot.start.split('T')[1].substring(0, 5)
            : selectedTimeSlot.start.split(' ')[1].substring(0, 5);

        endTime = selectedTimeSlot.end.includes('T')
            ? selectedTimeSlot.end.split('T')[1].substring(0, 5)
            : selectedTimeSlot.end.split(' ')[1].substring(0, 5);
    }

    const formattedDate = format(selectedDate, 'MMMM d, yyyy');

    const handleFinalConfirm = () => {

        onConfirm({
            ...appointmentDetails,
            sendEmailNotification
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay background */}
            <div
                className="absolute inset-0 backdrop-blur-lg bg-opacity-50"
                onClick={onClose}
            ></div>

            {/* Modal content */}
            <div
                className={`max-w-2xl w-full mx-4 bg-light-blue rounded-xl transform transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-pri items-center">APPOINTMENT CONFIRMED</h1>
                        <button
                            onClick={onClose}
                            className="text-pri hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <p className="text-center mb-4 text-pri text-lg">
                        YOUR APPOINTMENT IS SCHEDULED FOR<br/>
                        <span className="font-bold">{formattedDate}</span>
                    </p>

                    <div className="bg-ivory rounded-xl p-4 mb-4 text-pri flex items-center border border-pri">
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

                    {/* Email notification toggle */}
                    <div className="flex items-center justify-between text-pri bg-light-blue rounded-lg mb-4">
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

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg"
                        >
                            CANCEL
                        </button>
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

export default ConfirmAppointmentOverlay;