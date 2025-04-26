import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function Confirm() {
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem('selectedBooking'));
        if (!data) {
            // Handle case where no booking data exists
            alert("No booking selected. Please select a time slot first.");
            navigate('/Timeslot');
            return;
        }
        setBookingData(data);
    }, [navigate]);

    const handleConfirmBooking = async () => {
        try {
            // Replace with your actual API call
            // await fetch('/api/bookings', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(bookingData)
            // });

            // Clear the stored data
            sessionStorage.removeItem('selectedBooking');

            // Navigate to success page or show success message
            alert("Booking confirmed successfully!");
            navigate('/booking-success');
        } catch (error) {
            console.error("Error confirming booking:", error);
            alert("Failed to confirm booking. Please try again.");
        }
    };

    if (!bookingData) return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-4">
            <h2 className="text-2xl font-bold mb-4">Confirm Your Appointment</h2>

            <div className="bg-light-blue rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="font-bold">Doctor:</p>
                        <p>{bookingData.doctorName}</p>
                    </div>
                    <div>
                        <p className="font-bold">Department:</p>
                        <p>{bookingData.department}</p>
                    </div>
                    <div>
                        <p className="font-bold">Date:</p>
                        <p>{bookingData.date}</p>
                    </div>
                    <div>
                        <p className="font-bold">Time:</p>
                        <p>{bookingData.startTime} - {bookingData.endTime}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        className="bg-yellow text-white px-6 py-2 rounded-lg"
                        onClick={handleConfirmBooking}
                    >
                        Confirm Booking
                    </button>
                    <Link to="/Timeslot">
                        <button className="bg-gray-300 px-6 py-2 rounded-lg">
                            Go Back
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Confirm;