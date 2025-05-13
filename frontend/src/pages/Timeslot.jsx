import { useState } from 'react';

const DeeCare = () => {
    // Date setup for time slot display - matches the calendar
    const today = new Date();
    const firstDay = new Date(today);
    // Set to the first day of the current week (Sunday)
    const day = firstDay.getDay();
    firstDay.setDate(firstDay.getDate() - day);

    // Generate date strings for the current week
    const generateDateStrings = (startDate) => {
        const dates = [];
        for (let i = 0; i < 5; i++) {
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

    // Initial slots for doctors
    const initialSlots = {
        1: {
            availableSlots: {
                ...generateSlots(dateStrings[0].date, ['8:00', '8:30', '9:30', '10:00']),
                ...generateSlots(dateStrings[1].date, ['9:00', '9:30', '10:30', '11:00', '14:00', '14:30', '15:00']),
                ...generateSlots(dateStrings[2].date, ['8:00', '8:30', '10:00', '10:30', '11:00', '11:30', '15:00', '15:30', '16:00']),
                ...generateSlots(dateStrings[3].date, ['13:00', '13:30', '16:00', '16:30', '17:00', '17:30']),
                ...generateSlots(dateStrings[4].date, ['9:00', '9:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'])
            }
        },
        2: {
            availableSlots: {
                ...generateSlots(dateStrings[0].date, []),
                ...generateSlots(dateStrings[1].date, ['9:00', '9:30', '14:00', '14:30']),
                ...generateSlots(dateStrings[2].date, ['11:00', '11:30', '16:00', '16:30']),
                ...generateSlots(dateStrings[3].date, ['13:00', '13:30', '17:00', '17:30']),
                ...generateSlots(dateStrings[4].date, ['15:00', '15:30', '16:00', '16:30'])
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
    const [notification, setNotification] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [activeTab, setActiveTab] = useState('appointment');

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

    // Handle login
    const handleLogin = () => {
        // Simple mock login
        if (loginDetails.email && loginDetails.password) {
            setIsLoggedIn(true);
            setShowLoginForm(false);
            setNotification({
                type: 'success',
                message: 'Successfully logged in!'
            });

            setTimeout(() => {
                setNotification(null);
            }, 3000);
        }
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

        if (!isLoggedIn) {
            setShowLoginForm(true);
            return;
        }

        setNotification({
            type: 'success',
            message: `Appointment confirmed with ${selectedDoctor.name} on ${selectedDate} at ${selectedTimeSlot}`
        });

        setTimeout(() => {
            setNotification(null);
        }, 3000);
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

    // Switch doctor
    const switchDoctor = (direction) => {
        const currentIndex = doctors.findIndex(doc => doc.id === selectedDoctor.id);
        let newIndex;

        if (direction === 'prev') {
            newIndex = currentIndex === 0 ? doctors.length - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex === doctors.length - 1 ? 0 : currentIndex + 1;
        }

        setSelectedDoctor(doctors[newIndex]);

        // Clear selections when switching doctors
        setSelectedTimeSlot(null);
    };

    // Sync calendar month with current week
    const synchronizeCalendarMonth = () => {
        // If the current week spans across two months, use the month with more days
        const monthCounts = {};
        dateStrings.forEach(d => {
            const month = d.date.getMonth();
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });

        let dominantMonth = currentMonth.getMonth();
        let maxCount = 0;

        for (const [month, count] of Object.entries(monthCounts)) {
            if (count > maxCount) {
                maxCount = count;
                dominantMonth = parseInt(month);
            }
        }

        // Update calendar if needed
        if (dominantMonth !== currentMonth.getMonth()) {
            const newMonth = new Date(currentMonth);
            newMonth.setMonth(dominantMonth);
            setCurrentMonth(newMonth);
        }
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

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 
          ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {notification.message}
                </div>
            )}

            {/* Main Content */}
            <main className="container mx-auto flex-grow p-4 bg-white my-4 rounded-lg shadow">
                {/* Doctor Profile */}
                <div className="bg-blue-100 p-4 rounded-lg mb-6 flex items-center">
                    <button
                        className="bg-blue-500 text-white rounded-full p-2 mr-4 hover:bg-blue-600 active:bg-blue-700"
                        onClick={() => switchDoctor('prev')}
                    >
                        &lt;
                    </button>
                    <div className="bg-white rounded-full p-2 mr-4">
                        <img
                            src={selectedDoctor.image}
                            alt={selectedDoctor.name}
                            className="w-16 h-16 rounded-full"
                        />
                    </div>
                    <div>
                        <h2 className="text-blue-800 font-medium">NAME: {selectedDoctor.name}</h2>
                        <p className="text-blue-800">DEPARTMENT: {selectedDoctor.department}</p>
                        <p className="text-blue-800">WORK HOUR: {selectedDoctor.workHours}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Calendar */}
                    <div className="bg-blue-100 p-4 rounded-lg col-span-1">
                        <div className="flex justify-between mb-2">
                            <button
                                className="text-blue-800 hover:text-blue-600"
                                onClick={() => {
                                    const newDate = new Date(currentMonth);
                                    newDate.setMonth(newDate.getMonth() - 1);
                                    setCurrentMonth(newDate);
                                }}
                            >
                                &lt;
                            </button>
                            <div className="text-blue-800 font-medium">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <button
                                className="text-blue-800 hover:text-blue-600"
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
                                <div key={index} className="text-blue-800 font-medium">
                                    {day}
                                </div>
                            ))}

                            {generateCalendarDays().map((day, index) => (
                                <div
                                    key={index}
                                    className={`p-1 rounded-full cursor-pointer text-sm ${
                                        day.isCurrentMonth
                                            ? selectedDay && day.date.toDateString() === selectedDay.date.toDateString()
                                                ? 'bg-blue-500 text-white'
                                                : 'text-blue-800 hover:bg-blue-200'
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
                            className="w-full bg-orange-400 text-white py-2 rounded mt-4 hover:bg-orange-500 active:bg-orange-600"
                            onClick={handleConfirmAppointment}
                        >
                            Confirm
                        </button>
                    </div>

                    {/* Time Slots */}
                    <div className="md:col-span-4">
                        <div className="flex justify-between mb-4">
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                onClick={handlePrevWeek}
                            >
                                &lt; Previous Week
                            </button>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                onClick={handleNextWeek}
                            >
                                Next Week &gt;
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-max grid grid-cols-6 gap-1">
                                <div className="sticky left-0 text-center font-medium"></div>
                                {dateStrings.map((dateObj, index) => (
                                    <div
                                        key={index}
                                        className={`text-center font-medium text-sm p-1 ${
                                            selectedDate === dateObj.display ? 'bg-blue-100 rounded' : ''
                                        }`}
                                    >
                                        {dateObj.display}
                                    </div>
                                ))}

                                {generateTimeSlots().map((time, timeIndex) => (
                                    <>
                                        <div key={`time-${timeIndex}`} className="sticky left-0 text-center font-medium bg-white">
                                            {time}
                                        </div>
                                        {dateStrings.map((dateObj, dateIndex) => {
                                            const isAvailable = isTimeSlotAvailable(dateObj.display, time);
                                            const isSelected = selectedDate === dateObj.display && selectedTimeSlot === time;

                                            return (
                                                <div
                                                    key={`slot-${timeIndex}-${dateIndex}`}
                                                    className={`h-10 ${
                                                        isAvailable
                                                            ? 'bg-orange-300 cursor-pointer hover:bg-orange-400 active:bg-orange-500'
                                                            : 'bg-gray-100'
                                                    } ${
                                                        isSelected
                                                            ? 'ring-2 ring-blue-500'
                                                            : ''
                                                    }`}
                                                    onClick={() => {
                                                        if (isAvailable) {
                                                            setSelectedDate(dateObj.display);
                                                            setSelectedTimeSlot(time);
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

export default DeeCare;