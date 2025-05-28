import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import axios from 'axios';
import ConfirmAppointmentOverlay from '../components/ConfirmAppointment.jsx';
import {findDoctorByID} from '../api/getDoctors.js';

const Timeslot = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const doctorIdFromUrl = searchParams.get('id');

    // Date setup for time slot display - matches the calendar
    const today = new Date();
    const firstDay = new Date(today);
    const day = firstDay.getDay();
    firstDay.setDate(firstDay.getDate() - day);

    // Generate date strings for the current week (7 days)
    const generateDateStrings = (startDate) => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
            const day = date.getDate();
            const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
            dates.push({
                display: `${dayName}, ${day} ${month}`,
                date: date
            });
        }
        return dates;
    };

    const [currentWeekStart, setCurrentWeekStart] = useState(firstDay);
    const [dateStrings, setDateStrings] = useState(generateDateStrings(firstDay));

    // State variables
    const [doctors, setDoctors] = useState();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [notification, setNotification] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [availableSlots, setAvailableSlots] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Fetch doctors on component mount
    useEffect(() => {
        fetchDoctors(doctorIdFromUrl);
    }, [doctorIdFromUrl]);

    // Fetch available slots when doctor or week changes
    useEffect(() => {
        if (selectedDoctor) {
            fetchAvailableSlots();
        }
    }, [selectedDoctor, currentWeekStart]);

    // API Functions
    const fetchDoctors = async (id) => {
        try {
            console.log(id);
            const response = await findDoctorByID(id);
            if (response.success) {
                console.log(response.success)
                setDoctors(response.data);
            } else {
                console.log(response.success)
                console.error("Failed to fetch doctor");
            }
        } catch (e) {
            console.error("Error fetching doctor:", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        if (!selectedDoctor) return;

        try {
            setLoadingSlots(true);
            const slots = {};

            // Fetch slots for each day in the current week
            for (const dateObj of dateStrings) {
                const dateStr = dateObj.date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

                try {
                    const response = await api.get(`/doctors/${selectedDoctor.id}/availability`, {
                        params: {date: dateStr}
                    });

                    if (response.data && response.data.availableSlots) {
                        slots[dateObj.display] = response.data.availableSlots;
                    } else {
                        slots[dateObj.display] = [];
                    }
                } catch (error) {
                    console.error(`Error fetching slots for ${dateStr}:`, error);
                    slots[dateObj.display] = [];
                }
            }

            setAvailableSlots(slots);
        } catch (error) {
            console.error('Error fetching available slots:', error);
            showNotification('error', 'Failed to load available time slots.');
        } finally {
            setLoadingSlots(false);
        }
    };

    const createAppointment = async (appointmentData) => {
        try {
            const response = await api.post('/appointments', {
                doctorId: appointmentData.doctorId,
                date: appointmentData.date,
                sendEmailNotification: appointmentData.sendEmailNotification || true
            });

            if (response.data) {
                showNotification('success', 'Appointment created successfully!');
                return response.data;
            }
        } catch (error) {
            console.error('Error creating appointment:', error);

            if (error.response && error.response.data && error.response.data.error) {
                showNotification('error', error.response.data.error);
            } else {
                showNotification('error', 'Failed to create appointment. Please try again.');
            }
            throw error;
        }
    };

    // Utility function to show notifications
    const showNotification = (type, message) => {
        setNotification({type, message});
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    // Calendar navigation
    const handlePrevWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);

        const newDateStrings = generateDateStrings(newStart);
        setDateStrings(newDateStrings);

        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setSelectedDay(null);
    };

    const handleNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);

        const newDateStrings = generateDateStrings(newStart);
        setDateStrings(newDateStrings);

        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setSelectedDay(null);
    };

    // Calendar generation
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const prevMonthDays = firstDay === 0 ? 0 : firstDay;
        const totalCells = Math.ceil((daysInMonth + prevMonthDays) / 7) * 7;

        const days = [];

        // Previous month days
        const prevMonth = new Date(year, month, 0);
        const prevMonthDaysCount = getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());

        for (let i = 0; i < prevMonthDays; i++) {
            days.push({
                day: prevMonthDaysCount - prevMonthDays + i + 1,
                isCurrentMonth: false,
                isPrevMonth: true,
                date: new Date(year, month - 1, prevMonthDaysCount - prevMonthDays + i + 1)
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(year, month, i)
            });
        }

        // Next month days
        const remainingCells = totalCells - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                isNextMonth: true,
                date: new Date(year, month + 1, i)
            });
        }

        return days;
    };

    // Generate time slots (30 min intervals)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour < 18; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return slots;
    };

    // Check if a time slot is available
    const isTimeSlotAvailable = (date, time) => {
        if (!selectedDoctor || !date || !availableSlots[date]) return false;
        return availableSlots[date].includes(time);
    };

    // Handle appointment confirmation
    const handleConfirmAppointment = () => {
        if (!selectedDate || !selectedTimeSlot) {
            showNotification('error', 'Please select a date and time slot');
            return;
        }

        const [hour, minute] = selectedTimeSlot.split(':');
        const startDateTime = new Date(selectedDay.date);
        startDateTime.setHours(parseInt(hour), parseInt(minute), 0);

        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + 30);

        const details = {
            doctorInfo: {
                ...selectedDoctor,
                name: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
                department: selectedDoctor.specialty
            },
            selectedDate: selectedDay.date,
            selectedTimeSlot: {
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString()
            }
        };

        setAppointmentDetails(details);
        setShowConfirmOverlay(true);
    };

    // Handle overlay close
    const handleOverlayClose = () => {
        setShowConfirmOverlay(false);
    };

    // Handle final confirmation from overlay
    const handleFinalConfirm = async (confirmedDetails) => {
        try {
            const [hour, minute] = selectedTimeSlot.split(':');
            const appointmentDateTime = new Date(selectedDay.date);
            appointmentDateTime.setHours(parseInt(hour), parseInt(minute), 0);

            const appointmentData = {
                doctorId: selectedDoctor.id,
                date: appointmentDateTime.toISOString(),
                sendEmailNotification: confirmedDetails.sendEmailNotification || true
            };

            await createAppointment(appointmentData);
            setShowConfirmOverlay(false);

            // Clear selections
            setSelectedDate(null);
            setSelectedTimeSlot(null);
            setSelectedDay(null);

            // Refresh available slots
            fetchAvailableSlots();

        } catch (error) {
            console.error('Error confirming appointment:', error);
        }
    };

    // Handle day selection
    const handleDaySelection = (day) => {
        setSelectedDay(day);

        const isInCurrentWeek = dateStrings.some(d =>
            d.date.getDate() === day.date.getDate() &&
            d.date.getMonth() === day.date.getMonth() &&
            d.date.getFullYear() === day.date.getFullYear()
        );

        if (!isInCurrentWeek) {
            const newWeekStart = new Date(day.date);
            newWeekStart.setDate(day.date.getDate() - day.date.getDay());
            setCurrentWeekStart(newWeekStart);

            const newDateStrings = generateDateStrings(newWeekStart);
            setDateStrings(newDateStrings);

            const matchingDate = newDateStrings.find(d =>
                d.date.getDate() === day.date.getDate() &&
                d.date.getMonth() === day.date.getMonth()
            );

            if (matchingDate) {
                setSelectedDate(matchingDate.display);
            }
        } else {
            const matchingDate = dateStrings.find(d =>
                d.date.getDate() === day.date.getDate() &&
                d.date.getMonth() === day.date.getMonth()
            );

            if (matchingDate) {
                setSelectedDate(matchingDate.display);
            }
        }

        setSelectedTimeSlot(null);
    };

    // Handle doctor selection
    const handleDoctorChange = (doctor) => {
        setSelectedDoctor(doctor);
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setSelectedDay(null);
    };

    // Get weekday names
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Format time display (for better readability)
    const formatTimeDisplay = (time) => {
        const [hours, minutes] = time.split(':');
        const hourInt = parseInt(hours);

        let endHour = hourInt;
        let endMinutes = parseInt(minutes) + 30;

        if (endMinutes >= 60) {
            endHour += 1;
            endMinutes = 0;
        }

        return `${time}-${endHour.toString().padStart(2, '0')}:${endMinutes === 0 ? '00' : endMinutes}`;
    };

    // Handle time slot selection
    const handleTimeSlotSelection = (dateStr, time) => {
        if (isTimeSlotAvailable(dateStr, time)) {
            const selectedDateObj = dateStrings.find(d => d.display === dateStr);

            if (selectedDateObj) {
                setSelectedDate(dateStr);
                setSelectedTimeSlot(time);
                setSelectedDay({
                    date: selectedDateObj.date,
                    isCurrentMonth: true,
                    day: selectedDateObj.date.getDate()
                });
            }
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading doctors...</p>
                </div>
            </div>
        );
    }

    // No doctors state
    if (!doctors) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">No doctors available. Please try again later. {doctorIdFromUrl}</p>
                    <button
                        onClick={fetchDoctors}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 
                ${notification.type === 'success' ? 'bg-green-400' : 'bg-red-500'} text-white`}>
                    {notification.message}
                </div>
            )}

            {/* Confirmation Overlay */}
            {showConfirmOverlay && (
                <ConfirmAppointmentOverlay
                    appointmentDetails={appointmentDetails}
                    onClose={handleOverlayClose}
                    onConfirm={handleFinalConfirm}
                />
            )}

            {/* Back button to FindDoctor */}
            <div className="p-4">
                <button
                    onClick={() => navigate('/FindDoctor')}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                    Back to Doctor Selection
                </button>
            </div>

            {/* Main Content */}
            <main className="container mx-auto flex-grow p-4 bg-white my-4 rounded-lg shadow">
                {/* Doctor Selection - Show only if multiple doctors available */}
                {doctors.length > 1 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Select Doctor:</h3>
                        <div className="flex flex-wrap gap-2">
                            {doctors.map((doctor) => (
                                <button
                                    key={doctor.id}
                                    onClick={() => handleDoctorChange(doctor)}
                                    className={`px-4 py-2 rounded-lg border ${
                                        selectedDoctor?.id === doctor.id
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Doctor Profile */}
                {selectedDoctor && (
                    <div className="bg-ivory p-4 rounded-xl mb-6 flex items-center">
                        <div className="bg-white rounded-full p-2 mr-4">
                            <img
                                src={selectedDoctor.image || '/api/placeholder/200/200'}
                                alt={`${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                                className="w-16 h-16 rounded-full"
                            />
                        </div>
                        <div>
                            <h2 className="text-pri font-medium">NAME: {selectedDoctor.firstName} {selectedDoctor.lastName}</h2>
                            <p className="text-pri">DEPARTMENT: {selectedDoctor.specialty}</p>
                            <p className="text-pri">WORK HOUR: {selectedDoctor.workHours || '8:00-18:00'}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Calendar */}
                    <div className="bg-light-blue p-4 rounded-xl col-span-1">
                        <div className="flex justify-between mb-2">
                            <button
                                className="text-pri hover:text-blue-600"
                                onClick={() => {
                                    const newDate = new Date(currentMonth);
                                    newDate.setMonth(newDate.getMonth() - 1);
                                    setCurrentMonth(newDate);
                                }}
                            >
                                &lt;
                            </button>
                            <div className="text-pri font-medium">
                                {currentMonth.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}
                            </div>
                            <button
                                className="text-pri hover:text-blue-600"
                                onClick={() => {
                                    const newDate = new Date(currentMonth);
                                    newDate.setMonth(newDate.getMonth() + 1);
                                    setCurrentMonth(newDate);
                                }}
                            >
                                &gt;
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {weekdays.map((day, index) => (
                                <div key={index} className="text-pri font-medium">
                                    {day}
                                </div>
                            ))}

                            {generateCalendarDays().map((day, index) => (
                                <div
                                    key={index}
                                    className={`p-1 rounded cursor-pointer text-sm ${
                                        day.isCurrentMonth
                                            ? selectedDay && day.date.toDateString() === selectedDay.date.toDateString()
                                                ? 'bg-yellow text-background'
                                                : 'text-pri hover:bg-yellow-200'
                                            : 'text-gray-400'
                                    } ${
                                        day.day === new Date().getDate() &&
                                        currentMonth.getMonth() === new Date().getMonth() &&
                                        currentMonth.getFullYear() === new Date().getFullYear() &&
                                        (!selectedDay || day.date.toDateString() !== selectedDay.date.toDateString())
                                            ? 'bg-blue-300'
                                            : ''
                                    }`}
                                    onClick={() => handleDaySelection(day)}
                                >
                                    {day.day}
                                </div>
                            ))}
                        </div>

                        <button
                            className={`w-full ${selectedDate && selectedTimeSlot ? 'bg-yellow hover:bg-orange-400 active:bg-orange-400' : 'bg-gray-400 cursor-not-allowed'} text-white px-2 py-2 rounded-lg mt-4`}
                            onClick={handleConfirmAppointment}
                            disabled={!selectedDate || !selectedTimeSlot}
                        >
                            {selectedDate && selectedTimeSlot ? 'Confirm Appointment' : 'Select a time slot'}
                        </button>
                    </div>

                    {/* Time Slots */}
                    <div className="md:col-span-4">
                        <div className="flex justify-between mb-4">
                            <button
                                className="bg-pri text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-600"
                                onClick={handlePrevWeek}
                            >
                                <div className="flex flex-row justify-between items-center">
                                    <p>&lt; </p>
                                    <p>Previous Week</p>
                                </div>
                            </button>
                            <div className="text-pri font-medium pl-8 pr-8">
                                {selectedDay ?
                                    `Selected: ${selectedDay.date.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric'
                                    })}` :
                                    'Select a date from calendar or time slot grid'
                                }
                            </div>
                            <button
                                className="bg-pri text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-600"
                                onClick={handleNextWeek}
                            >
                                <div className="flex flex-row justify-between items-center">
                                    <p>Next Week</p>
                                    <p>&gt; </p>
                                </div>
                            </button>
                        </div>

                        {loadingSlots ? (
                            <div className="text-center py-8">
                                <div
                                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading available slots...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="min-w-max grid grid-cols-8 gap-1">
                                    <div className="sticky left-0 text-center font-medium"></div>
                                    {dateStrings.map((dateObj, index) => (
                                        <div
                                            key={index}
                                            className={`text-center font-medium text-sm p-1 text-pri ${
                                                selectedDate === dateObj.display ? 'bg-blue-100 rounded-lg' : ''
                                            }`}
                                        >
                                            {dateObj.display}
                                        </div>
                                    ))}

                                    {generateTimeSlots().map((time, timeIndex) => (
                                        <>
                                            <div key={`time-${timeIndex}`}
                                                 className="sticky left-0 text-center font-medium text-pri bg-ivory pt-2">
                                                {time}
                                            </div>
                                            {dateStrings.map((dateObj, dateIndex) => {
                                                const isAvailable = isTimeSlotAvailable(dateObj.display, time);
                                                const isSelected = selectedDate === dateObj.display && selectedTimeSlot === time;

                                                return (
                                                    <div
                                                        key={`slot-${timeIndex}-${dateIndex}`}
                                                        className={`h-10 text-center pt-1 text-pri ${
                                                            isAvailable
                                                                ? 'bg-orange-200 cursor-pointer hover:bg-orange-400 active:bg-yellow rounded-lg'
                                                                : 'bg-gray-100 rounded-lg'
                                                        } ${
                                                            isSelected
                                                                ? 'bg-yellow ring-2 ring-background'
                                                                : ''
                                                        }`}
                                                        onClick={() => {
                                                            if (isAvailable) {
                                                                handleTimeSlotSelection(dateObj.display, time);
                                                            }
                                                        }}
                                                    >
                                                        {isAvailable && (
                                                            <div className="text-center pt-2 text-xs">
                                                                {formatTimeDisplay(time)}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Timeslot;