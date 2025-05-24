import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ConfirmAppointmentOverlay from '../components/ConfirmAppointment.jsx';

const Timeslot = () => {
    const navigate = useNavigate();

    // Date setup for time slot display - matches the calendar
    const today = new Date();
    const firstDay = new Date(today);
    // Set to the first day of the current week (Sunday)
    const day = firstDay.getDay();
    firstDay.setDate(firstDay.getDate() - day);

    // Generate date strings for the current week (7 days instead of 5)
    const generateDateStrings = (startDate) => {
        const dates = [];
        for (let i = 0; i < 7; i++) { // Changed from 5 to 7 to include Friday and Saturday
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

    // Sample doctor data with 30-min slots
    const generateSlots = (date, slots) => {
        const formattedDate = `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}, ${date.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]}`;

        const available = {};
        available[formattedDate] = slots;
        return available;
    };

    // Initial slots for doctors - extended to include Friday and Saturday
    const initialSlots = {
        1: {
            availableSlots: {
                ...generateSlots(dateStrings[0].date, ['8:00', '8:30', '9:30', '10:00']),
                ...generateSlots(dateStrings[1].date, ['9:00', '9:30', '10:30', '11:00', '14:00', '14:30', '15:00']),
                ...generateSlots(dateStrings[2].date, ['8:00', '8:30', '10:00', '10:30', '11:00', '11:30', '15:00', '15:30', '16:00']),
                ...generateSlots(dateStrings[3].date, ['13:00', '13:30', '16:00', '16:30', '17:00', '17:30']),
                ...generateSlots(dateStrings[4].date, ['9:00', '9:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30']),
                ...generateSlots(dateStrings[5].date, ['10:00', '10:30', '11:00', '11:30', '14:00']), // Friday
                ...generateSlots(dateStrings[6].date, ['9:00', '9:30', '13:00', '13:30']) // Saturday
            }
        },
        2: {
            availableSlots: {
                ...generateSlots(dateStrings[0].date, []),
                ...generateSlots(dateStrings[1].date, ['9:00', '9:30', '14:00', '14:30']),
                ...generateSlots(dateStrings[2].date, ['11:00', '11:30', '16:00', '16:30']),
                ...generateSlots(dateStrings[3].date, ['13:00', '13:30', '17:00', '17:30']),
                ...generateSlots(dateStrings[4].date, ['15:00', '15:30', '16:00', '16:30']),
                ...generateSlots(dateStrings[5].date, ['9:00', '10:00', '11:00']), // Friday
                ...generateSlots(dateStrings[6].date, []) // Saturday - no slots
            }
        }
    };

    // Doctors data
    const [doctors] = useState([
        {
            id: 1,
            name: 'Dr. Good Doctor',
            department: 'General Health',
            workHours: '8:00-18:00',
            image: '/api/placeholder/200/200',
            availableSlots: initialSlots[1].availableSlots
        },
        {
            id: 2,
            name: 'Dr. Jane Smith',
            department: 'Cardiology',
            workHours: '9:00-17:00',
            image: '/api/placeholder/200/200',
            availableSlots: initialSlots[2].availableSlots
        }
    ]);

    // State variables
    const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [notification, setNotification] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState(null);

    // Calendar navigation
    const handlePrevWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);

        // Update date strings for the grid
        const newDateStrings = generateDateStrings(newStart);
        setDateStrings(newDateStrings);

        // Update available slots based on new dates
        updateAvailableSlots(newDateStrings);

        // Clear selections when changing week
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setSelectedDay(null);
    };

    const handleNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);

        // Update date strings for the grid
        const newDateStrings = generateDateStrings(newStart);
        setDateStrings(newDateStrings);

        // Update available slots based on new dates
        updateAvailableSlots(newDateStrings);

        // Clear selections when changing week
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setSelectedDay(null);
    };

    // Update available slots when week changes
    const updateAvailableSlots = (dates) => {
        // Generate new random slots for each doctor
        const newSlots = {};

        doctors.forEach(doctor => {
            newSlots[doctor.id] = {
                availableSlots: {}
            };

            dates.forEach(dateObj => {
                // Skip weekends for some doctors
                if (doctor.id === 2 && dateObj.date.getDay() === 0) {
                    newSlots[doctor.id].availableSlots[dateObj.display] = [];
                    return;
                }

                // Generate random slots
                const slots = [];
                for (let hour = 8; hour < 18; hour++) {
                    // Add slots with some randomness
                    if (Math.random() > 0.7) slots.push(`${hour}:00`);
                    if (Math.random() > 0.7) slots.push(`${hour}:30`);
                }

                newSlots[doctor.id].availableSlots[dateObj.display] = slots;
            });
        });

        // Update doctors with new slots
        const updatedDoctors = doctors.map(doctor => ({
            ...doctor,
            availableSlots: newSlots[doctor.id].availableSlots
        }));

        // Update selected doctor
        const updatedSelectedDoctor = updatedDoctors.find(d => d.id === selectedDoctor.id);
        setSelectedDoctor(updatedSelectedDoctor);
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
            slots.push(`${hour}:00`);
            slots.push(`${hour}:30`);
        }
        return slots;
    };

    // Check if a time slot is available
    const isTimeSlotAvailable = (date, time) => {
        if (!selectedDoctor || !date) return false;

        const availableSlots = selectedDoctor.availableSlots[date] || [];
        return availableSlots.includes(time);
    };

    // Handle appointment confirmation
    const handleConfirmAppointment = () => {
        if (!selectedDate || !selectedTimeSlot) {
            setNotification({
                type: 'error',
                message: 'Please select a date and time slot'
            });

            setTimeout(() => {
                setNotification(null);
            }, 3000);
            return;
        }

        // Format the time slot for the confirmation page
        const [hour, minute] = selectedTimeSlot.split(':');
        const startDateTime = new Date(selectedDay.date);
        startDateTime.setHours(parseInt(hour), parseInt(minute), 0);

        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + 30);

        const details = {
            doctorInfo: selectedDoctor,
            selectedDate: selectedDay.date,
            selectedTimeSlot: {
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString()
            }
        };

        // Set the appointment details and show the overlay
        setAppointmentDetails(details);
        setShowConfirmOverlay(true);
    };

    // Handle overlay close
    const handleOverlayClose = () => {
        setShowConfirmOverlay(false);
    };

    // Handle final confirmation from overlay
    const handleFinalConfirm = (confirmedDetails) => {
        // Here you can handle saving the appointment data
        console.log('Appointment confirmed with details:', confirmedDetails);
        setShowConfirmOverlay(false);

        // Show success notification
        setNotification({
            type: 'success',
            message: 'Appointment has been confirmed!'
        });

        setTimeout(() => {
            setNotification(null);
        }, 3000);

        // Optional: Navigate to another page or reset the form
        // navigate('/dashboard');
    };

    // Handle day selection
    const handleDaySelection = (day) => {
        setSelectedDay(day);

        // Format the date to match the format used in dateStrings
        const formatted = day.date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });

        // Update the weekday grid if the selected day is not in the current week view
        const isInCurrentWeek = dateStrings.some(d =>
            d.date.getDate() === day.date.getDate() &&
            d.date.getMonth() === day.date.getMonth() &&
            d.date.getFullYear() === day.date.getFullYear()
        );

        if (!isInCurrentWeek) {
            // Find the start of the week for this day
            const newWeekStart = new Date(day.date);
            newWeekStart.setDate(day.date.getDate() - day.date.getDay());
            setCurrentWeekStart(newWeekStart);

            // Update date strings
            const newDateStrings = generateDateStrings(newWeekStart);
            setDateStrings(newDateStrings);

            // Update available slots
            updateAvailableSlots(newDateStrings);

            // Find the matching date in the new strings
            const matchingDate = newDateStrings.find(d =>
                d.date.getDate() === day.date.getDate() &&
                d.date.getMonth() === day.date.getMonth()
            );

            if (matchingDate) {
                setSelectedDate(matchingDate.display);
            }
        } else {
            // Find the matching date in current dateStrings
            const matchingDate = dateStrings.find(d =>
                d.date.getDate() === day.date.getDate() &&
                d.date.getMonth() === day.date.getMonth()
            );

            if (matchingDate) {
                setSelectedDate(matchingDate.display);
            }
        }

        // Clear the time slot when date changes
        setSelectedTimeSlot(null);
    };

    // Get weekday names
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Format time display (for better readability)
    const formatTimeDisplay = (time) => {
        const [hours, minutes] = time.split(':');
        const hourInt = parseInt(hours);

        // Calculate the end time (30 min later)
        let endHour = hourInt;
        let endMinutes = parseInt(minutes) + 30;

        if (endMinutes >= 60) {
            endHour += 1;
            endMinutes = 0;
        }

        return `${time}-${endHour}:${endMinutes === 0 ? '00' : endMinutes}`;
    };

    // Handle time slot selection
    const handleTimeSlotSelection = (dateStr, time) => {
        // Only allow selection if the slot is available
        if (isTimeSlotAvailable(dateStr, time)) {
            // Find the corresponding day object based on the dateStr
            const selectedDateObj = dateStrings.find(d => d.display === dateStr);

            if (selectedDateObj) {
                // Update all state variables consistently
                setSelectedDate(dateStr);
                setSelectedTimeSlot(time);
                setSelectedDay({
                    date: selectedDateObj.date,
                    isCurrentMonth: true, // These properties are needed for consistency with calendar selection
                    day: selectedDateObj.date.getDate()
                });
            }
        }
    };

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

            {/* Main Content */}
            <main className="container mx-auto flex-grow p-4 bg-white my-4 rounded-lg shadow">
                {/* Doctor Profile */}
                <div className="bg-light-blue p-4 rounded-xl mb-6 flex items-center">

                    <div className="bg-white rounded-full p-2 mr-4">
                        <img
                            src={selectedDoctor.image}
                            alt={selectedDoctor.name}
                            className="w-16 h-16 rounded-full"
                        />
                    </div>
                    <div>
                        <h2 className="text-pri font-medium">NAME: {selectedDoctor.name}</h2>
                        <p className="text-pri">DEPARTMENT: {selectedDoctor.department}</p>
                        <p className="text-pri">WORK HOUR: {selectedDoctor.workHours}</p>
                    </div>

                </div>

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

                        {/* Only show confirm button when date and time are selected */}
                        <button
                            className={`w-full ${selectedDate && selectedTimeSlot ? 'bg-orange-400 hover:bg-orange-500 active:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'} text-white px-2 py-2 rounded-lg mt-4`}
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
                            <div className=" text-pri font-medium pl-8 pr-8">
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
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Timeslot;