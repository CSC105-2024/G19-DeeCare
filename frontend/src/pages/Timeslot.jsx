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

// Import our modified custom component
import AvailableTime from '../components/AvailableTime';
import useAvailableTime from '../hooks/useAvailableTime';

const EmptyComponent = props => {
    return null;
};

const calendarCustomComponents = {
    headerContent: EmptyComponent,
};

function Timeslot() {
    const navigate = useNavigate();

    // Doctor information (could come from props or context in a real app)
    const doctorInfo = {
        name: "Dr. Apple",
        department: "General Health",
        workHours: "8:00-16:00",
        image: "/images/Dr_Apple.jpg"
    };

    // Use our custom hook
    const {
        selectedDate,
        selectedTimeSlot,
        availableSlots,
        isLoading,
        handleDateChange,
        handleTimeSlotSelected,
        saveBooking
    } = useAvailableTime(new Date());

    const eventsService = useState(() => createEventsServicePlugin())[0];
    const calendarControls = useState(() => createCalendarControlsPlugin())[0];

    // Custom event click handler
    const handleEventClick = (eventId) => {
        const clickedSlot = availableSlots.find(slot => slot.id === eventId);
        if (clickedSlot && clickedSlot.isAvailable) {
            handleTimeSlotSelected(clickedSlot);
        }
    };

    // Initialize event modal plugin with our custom click handler
    const eventModalPlugin = useState(() => createEventModalPlugin({
        onEventClick: handleEventClick
    }))[0];

    const calendar = useCalendarApp({
        views: [
            createViewWeek(),
        ],
        events: availableSlots, // Start with available slots
        plugins: [
            calendarControls,
            eventsService,
            eventModalPlugin,
            createCurrentTimePlugin()
        ],
        dayBoundaries: {
            start: '06:00',
            end: '18:00',
        },
        isResponsive: true,
    });

    const handleMiniCalendarChange = (date) => {
        handleDateChange(date);
        calendarControls.setDate(format(date, 'yyyy-MM-dd'));
        calendarControls.setFirstDayOfWeek(0);
        calendar.destroy();
        calendar.render(document.getElementById('calendar'));
    };

    const handleConfirmClick = () => {
        if (!selectedTimeSlot) {
            alert("Please select an available time slot first");
            return;
        }

        const success = saveBooking(doctorInfo);
        if (success) {
            navigate("/Confirm");
        }
    };

    // Update events when availableSlots change
    useEffect(() => {
        if (calendar && calendar.setEvents) {
            calendar.setEvents(availableSlots);
        }
    }, [availableSlots, calendar]);

    return (
        <>
            {/* Whole page */}
            <div className="max-w-6xl mx-auto mt-4">

                {/* Doctor  */}
                <div className="bg-light-blue rounded-2xl p-6 mb-6">
                    {/* inside */}
                    <div className="flex justify-start items-center ">
                        {/* doctor image */}
                        <img src={doctorInfo.image}
                             alt={doctorInfo.name}
                             className="rounded-full w-[150px] mr-[64px]"
                        />
                        {/* doctor detail */}
                        <div className="flex flex-col justify-center">
                            <p>Name: {doctorInfo.name}</p>
                            <p>Department: {doctorInfo.department}</p>
                            <p>Work hour: {doctorInfo.workHours}</p>
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

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="mb-4 p-3 text-center">
                                <p>Loading available times...</p>
                            </div>
                        )}

                        {/* Confirm button */}
                        <button
                            className="w-full rounded-lg py-2 text-white bg-yellow"
                            onClick={handleConfirmClick}
                            disabled={!selectedTimeSlot}
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