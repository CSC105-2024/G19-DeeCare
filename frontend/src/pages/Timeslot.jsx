import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import '../styles/react-calendar.css';

import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import { createViewWeek } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import '@schedule-x/theme-default/dist/index.css';
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { format } from 'date-fns';

const EmptyComponent = props => {
    return null;
};

const calendarCustomComponents = {
    headerContent: EmptyComponent,
};

function Timeslot() {
    const navigate = useNavigate();
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([
        {
            id: 'slot-1',
            title: 'Available',
            start: '2025-04-21 08:00',
            end: '2025-04-21 09:00',
            color: '#f9a825', // Orange color for available slots
            editable: false,
            isAvailable: true
        },
        {
            id: 'slot-2',
            title: 'Available',
            start: '2025-04-21 10:00',
            end: '2025-04-21 11:00',
            color: '#f9a825',
            editable: false,
            isAvailable: true
        },
        // Add more available slots as needed
    ]);

    const eventsService = useState(() => createEventsServicePlugin())[0];
    const calendarControls = useState(() => createCalendarControlsPlugin())[0];

    const calendar = useCalendarApp({
        views: [
            createViewWeek(),
        ],
        events: availableSlots,
        plugins: [
            calendarControls,
            eventsService,
            createEventModalPlugin({
                onEventClick: (eventId) => handleEventClick(eventId),
            }),
            createCurrentTimePlugin()
        ],
        dayBoundaries: {
            start: '06:00',
            end: '18:00',
        },
        isResponsive: true,
    });

    const handleEventClick = (eventId) => {
        const clickedSlot = availableSlots.find(slot => slot.id === eventId);

        if (clickedSlot && clickedSlot.isAvailable) {
            setSelectedTimeSlot(clickedSlot);
            // Visual feedback - could be done via state update if schedule-x supports it
            console.log(`Selected time slot: ${clickedSlot.start} - ${clickedSlot.end}`);
        }
    };

    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleMiniCalendarChange = (date) => {
        setSelectedDate(date);
        calendarControls.setDate(format(date, 'yyyy-MM-dd'));
        calendarControls.setFirstDayOfWeek(0);
        calendar.destroy();
        calendar.render(document.getElementById('calendar'));

        // Here you would typically load available slots for the selected date
        // fetchAvailableSlotsForDate(date);
    };

    const handleConfirmClick = () => {
        if (!selectedTimeSlot) {
            alert("Please select an available time slot first");
            return;
        }

        // Store the selected time slot in localStorage or sessionStorage
        sessionStorage.setItem('selectedBooking', JSON.stringify({
            date: format(selectedDate, 'yyyy-MM-dd'),
            startTime: selectedTimeSlot.start.split(' ')[1],
            endTime: selectedTimeSlot.end.split(' ')[1],
            doctorName: "Dr. Apple", // Get this from your actual data
            department: "General Health" // Get this from your actual data
        }));

        // Navigate to confirmation page
        navigate("/Confirm");
    };

    useEffect(() => {
        // Load available slots when component mounts
        // This would typically be a fetch from your API
        eventsService.getAll();
    }, []);

    return (
        <>
            {/* Whole page */}
            <div className="max-w-6xl mx-auto mt-4">

                {/* Doctor  */}
                <div className="bg-light-blue rounded-2xl p-6 mb-6">
                    {/* inside */}
                    <div className="flex justify-start items-center ">
                        {/* doctor image */}
                        <img src="/images/Dr_Apple.jpg"
                             alt="doctor Apple"
                             className="rounded-full w-[150px] mr-[64px]"
                        />
                        {/* doctor detail */}
                        <div className="flex flex-col justify-center">
                            <p>Name: Dr. Apple</p>
                            <p>Department: General Health</p>
                            <p>Work hour: 8:00-16:00</p>
                        </div>
                    </div>
                </div>

                {/* both calendars */}
                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Left part */}
                    <div className="flex sm:flex-col lg:w-1/4">
                        {/* small Calendar */}
                        <div className="mb-4">
                            <Calendar
                                onChange={handleMiniCalendarChange}
                                value={selectedDate}
                                locale="en-US"
                            />
                        </div>

                        {/* Selected time slot display */}
                        {selectedTimeSlot && (
                            <div className="mb-4 p-3 border-2 border-yellow rounded-lg">
                                <p className="font-bold">Selected Time:</p>
                                <p>{format(selectedDate, 'MMMM d, yyyy')}</p>
                                <p>{selectedTimeSlot.start.split(' ')[1]} - {selectedTimeSlot.end.split(' ')[1]}</p>
                            </div>
                        )}

                        {/* Confirm button */}
                        <button
                            className="w-full rounded-lg py-2 text-white bg-yellow"
                            onClick={handleConfirmClick}
                        >
                            CONFIRM
                        </button>
                    </div>

                    {/* Full Calendar */}
                    <div className="lg:w-3/4" id="calendar">
                        <ScheduleXCalendar
                            calendarApp={calendar}
                            customComponents={calendarCustomComponents}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Timeslot;