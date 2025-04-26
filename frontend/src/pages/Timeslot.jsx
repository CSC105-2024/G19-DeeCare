import { useNavigate } from "react-router-dom";
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
import { format, isWithinInterval } from 'date-fns';

// Import our custom components
import TimeSlotSelector from '../components/TimeSlotSelector';
import useAvailableTime from '../hook/useAvailableTime.jsx';
import AvailableTime from '../components/AvailableTime';

// Empty component for custom calendar header
const EmptyComponent = props => {
    return null;
};

const calendarCustomComponents = {
    headerContent: EmptyComponent,
};

function Timeslot() {
    const navigate = useNavigate();

    // Toggle between calendar view and simple selector
    const [showSimpleSelector, setShowSimpleSelector] = useState(true);

    // Define booking period (Apr 28, 2025 - May 16, 2025)
    const bookingStartDate = new Date(2025, 3, 28); // April 28, 2025
    const bookingEndDate = new Date(2025, 4, 16);   // May 16, 2025

    // Initialize with booking start date if today is outside the range
    const today = new Date();
    const initialDate = isWithinInterval(today, {
        start: bookingStartDate,
        end: bookingEndDate
    }) ? today : bookingStartDate;

    // Doctor information
    const doctorInfo = {
        name: "Dr. Apple",
        department: "General Health",
        workHours: "8:00-16:00",
        image: "/images/Dr_Apple.jpg"
    };

    // Use our custom hook with mock data
    const {
        selectedDate,
        selectedTimeSlot,
        availableSlots,
        isLoading,
        handleDateChange,
        handleTimeSlotSelected,
        saveBooking
    } = useAvailableTime(initialDate);

    const eventsService = useState(() => createEventsServicePlugin())[0];
    const calendarControls = useState(() => createCalendarControlsPlugin())[0];

    // Initialize event modal plugin with our custom click handler
    const eventModalPlugin = useState(() => createEventModalPlugin({
        onEventClick: (eventId) => {
            const clickedSlot = availableSlots.find(slot => slot.id === eventId);
            if (clickedSlot && clickedSlot.isAvailable) {
                handleTimeSlotSelected(clickedSlot);
            }
        }
    }))[0];

    const calendar = useCalendarApp({
        views: [
            createViewWeek(),
        ],
        events: [],
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

    // Custom tileDisabled function for Calendar component
    const tileDisabled = ({ date, view }) => {
        // Disable dates outside booking period
        if (view === 'month') {
            return !isWithinInterval(date, {
                start: bookingStartDate,
                end: bookingEndDate
            });
        }
        return false;
    };

    const handleMiniCalendarChange = (date) => {
        handleDateChange(date);
        calendarControls.setDate(format(date, 'yyyy-MM-dd'));
        calendarControls.setFirstDayOfWeek(0);

        if (!showSimpleSelector) {
            calendar.destroy();
            calendar.render(document.getElementById('calendar'));
        }
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
        if (!showSimpleSelector && calendar && calendar.setEvents) {
            calendar.setEvents(availableSlots);
        }
    }, [availableSlots, calendar, showSimpleSelector]);

    // Ensure calendar renders after loading
    useEffect(() => {
        if (!showSimpleSelector && document.getElementById('calendar')) {
            calendar.render(document.getElementById('calendar'));
        }
    }, [calendar, showSimpleSelector]);

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

                {/* Booking period notice */}
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="font-bold">Booking Period: April 28, 2025 - May 16, 2025</p>
                    <p>Please select a date within this range to see available time slots.</p>
                </div>

                {/* Toggle view option */}
                <div className="mb-4">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
                        onClick={() => setShowSimpleSelector(!showSimpleSelector)}
                    >
                        Switch to {showSimpleSelector ? 'Calendar View' : 'Simple View'}
                    </button>
                </div>

                {/* both calendars */}
                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Left part */}
                    <div className="flex flex-col lg:w-1/4">
                        {/* small Calendar */}
                        <div className="mb-4">
                            <Calendar
                                onChange={handleMiniCalendarChange}
                                value={selectedDate}
                                locale="en-US"
                                tileDisabled={tileDisabled}
                                minDate={bookingStartDate}
                                maxDate={bookingEndDate}
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
                            className={`w-full rounded-lg py-2 text-white ${selectedTimeSlot ? 'bg-yellow hover:bg-yellow-600' : 'bg-gray-300 cursor-not-allowed'}`}
                            onClick={handleConfirmClick}
                            disabled={!selectedTimeSlot}
                        >
                            CONFIRM
                        </button>
                    </div>

                    {/* Right part - Calendar or Simple Selector */}
                    <div className="lg:w-3/4">
                        {showSimpleSelector ? (
                            <TimeSlotSelector
                                availableSlots={availableSlots}
                                selectedSlot={selectedTimeSlot}
                                onSlotSelect={handleTimeSlotSelected}
                                isLoading={isLoading}
                            />
                        ) : (
                            <div id="calendar">
                                <ScheduleXCalendar
                                    calendarApp={calendar}
                                    customComponents={calendarCustomComponents}
                                />
                                <AvailableTime
                                    calendar={calendar}
                                    onTimeSlotSelected={handleTimeSlotSelected}
                                    availableSlots={availableSlots}
                                    selectedDate={selectedDate}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Timeslot;