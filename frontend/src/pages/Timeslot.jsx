import {useNavigate} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import Calendar from 'react-calendar';
import '../styles/react-calendar.css';
import {format, isWithinInterval} from 'date-fns';

// import { ScheduleXCalendar } from '@schedule-x/react';
import {createCalendar, createViewWeek} from '@schedule-x/calendar';
import {createEventsServicePlugin} from '@schedule-x/events-service';
import {createEventModalPlugin} from '@schedule-x/event-modal';
import '@schedule-x/theme-default/dist/index.css';

import useAvailableTime from '../hook/useAvailableTime.jsx';
import {AvailableTimePlugin} from '../plugin/AvailableTimePlugin.jsx';

function Timeslot() {
    const navigate = useNavigate();
    const calendarRef = useRef(null);

    // Define booking period (Apr 28, 2025 - May 16, 2025)
    const bookingStartDate = new Date(2025, 3, 28);
    const bookingEndDate = new Date(2025, 7, 16);

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

    // Use our custom hook
    const {
        selectedDate,
        selectedTimeSlot,
        availableSlots,
        isLoading,
        handleDateChange,
        handleTimeSlotSelected,
        saveBooking
    } = useAvailableTime(initialDate);

    // Toggle between calendar and list view
    const [showCalendarView, setShowCalendarView] = useState(false);

    // Store the calendar app and plugins as refs
    const calendarAppRef = useRef(null);
    const eventsServicePluginRef = useRef(null);
    const eventModalPluginRef = useRef(null);
    const availableTimePluginRef = useRef(null);

    // Initialize or update the available time plugin when availableSlots change
    useEffect(() => {
        if (!availableTimePluginRef.current) {
            availableTimePluginRef.current = new AvailableTimePlugin({
                onTimeSlotSelected: handleTimeSlotSelected,
                availableSlots: availableSlots,
                selectedDate: selectedDate
            });
        } else {
            availableTimePluginRef.current.updateAvailableSlots(availableSlots);
            availableTimePluginRef.current.updateSelectedDate(selectedDate);
        }
    }, [availableSlots, selectedDate, handleTimeSlotSelected]);

    // Create or recreate the Schedule-X calendar when needed
    useEffect(() => {
        if (showCalendarView) {
            // Only attempt to create calendar when we have slots and the plugin
            if (isLoading || !availableSlots.length) return;

            // Create plugins if they don't exist
            if (!eventsServicePluginRef.current) {
                eventsServicePluginRef.current = createEventsServicePlugin();
            }
            if (!eventModalPluginRef.current) {
                eventModalPluginRef.current = createEventModalPlugin();
            }

            // Create or recreate calendar
            if (calendarAppRef.current) {
                calendarAppRef.current.destroy();
            }

            const calendarApp = createCalendar({
                views: [createViewWeek()],
                defaultView: 'week',
                dayBoundaries: {
                    start: '08:00',
                    end: '16:00',
                },
                isResponsive: true,
                initialDate: format(selectedDate, 'yyyy-MM-dd')
            }, [
                eventsServicePluginRef.current,
                eventModalPluginRef.current,
                availableTimePluginRef.current
            ]);

            // Store ref to calendar app
            calendarAppRef.current = calendarApp;

            // Render calendar
            if (calendarRef.current) {
                calendarAppRef.current.render(calendarRef.current);
                console.log("Calendar rendered");
            }

            // Cleanup on unmount
            return () => {
                if (calendarAppRef.current) {
                    calendarAppRef.current.destroy();
                }
            };
        }
    }, [selectedDate, availableSlots, isLoading, showCalendarView]);

    // Custom tileDisabled function for Calendar component
    const tileDisabled = ({date, view}) => {
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
    };

    const handleConfirmClick = () => {
        if (!selectedTimeSlot) {
            alert("Please select an available time slot first");
            return;
        }

        // Instead of calling saveBooking here, let's navigate to confirm page with data
        navigate("/Confirm", {
            state: {
                appointmentDetails: {
                    doctorInfo,
                    selectedDate,
                    selectedTimeSlot
                }
            }
        });
    };

    // Group time slots by hour for display
    const groupTimeSlotsByHour = () => {
        const groupedSlots = {};

        availableSlots.forEach(slot => {
            if (!slot.isAvailable) return;

            const startTime = slot.start.includes('T')
                ? slot.start.split('T')[1].substring(0, 5)
                : slot.start.split(' ')[1].substring(0, 5);

            const hour = startTime.split(':')[0];

            if (!groupedSlots[hour]) {
                groupedSlots[hour] = [];
            }

            groupedSlots[hour].push(slot);
        });

        return groupedSlots;
    };

    const groupedTimeSlots = groupTimeSlotsByHour();

    return (
        <>
            <div className="px-6 py-8">
                <div className="max-w-6xl mx-auto mt-4">
                    {/* Doctor */}
                    <div className="flex flex-col sm:flex-row justify-start items-center bg-light-blue gap-6 mb-6 p-6 rounded-xl border-1 border-pri">
                        <img
                            src={doctorInfo.image}
                            alt={doctorInfo.name}
                            className="rounded-full w-[120px] sm:w-[150px]"
                        />
                        <div className="flex flex-col text-pri text-lg md:text-xl">
                            <p className="font-extrabold">Name: {doctorInfo.name}</p>
                            <p>Department: {doctorInfo.department}</p>
                            <p>Work hour: {doctorInfo.workHours}</p>
                        </div>
                    </div>

                    {/*<div className="bg-light-blue rounded-2xl p-6 mb-6">*/}
                    {/*    <div className="flex justify-start items-center">*/}
                    {/*        <img src={doctorInfo.image}*/}
                    {/*             alt={doctorInfo.name}*/}
                    {/*             className="rounded-full w-[150px] mr-[64px]"*/}
                    {/*        />*/}
                    {/*        <div className="flex flex-col justify-center text-pri text-lg md:xl font-semibold">*/}
                    {/*            <p className="font-extrabold">Name: {doctorInfo.name}</p>*/}
                    {/*            <p>Department: {doctorInfo.department}</p>*/}
                    {/*            <p>Work hour: {doctorInfo.workHours}</p>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Booking period notice */}
                    {/*<div className="mb-4 p-3 bg-ivory border border-yellow rounded-lg text-pri">*/}
                    {/*    <p className="font-bold">Booking Period: April 28, 2025 - May 16, 2025</p>*/}
                    {/*    <p>Please select a date within this range to see available time slots.</p>*/}
                    {/*</div>*/}

                    {/* View toggle button */}
                    <button
                        className="mb-4 px-4 py-2 bg-ivory rounded-lg border-1 border-pri hover:bg-ivory-600 text-pri"
                        onClick={() => setShowCalendarView(!showCalendarView)}
                    >
                        Switch to {showCalendarView ? 'List' : 'Calendar'} View
                    </button>

                    {showCalendarView ? (
                        // Calendar view layout
                        <div className='flex flex-col lg:flex-row gap-6'>
                            {/* Left part */}
                            <div className="flex flex-col lg:w-1/4">
                                {/* Mini Calendar */}
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
                                        <p>
                                            {selectedTimeSlot.start.includes('T')
                                                ? selectedTimeSlot.start.split('T')[1].substring(0, 5)
                                                : selectedTimeSlot.start.split(' ')[1]
                                            } -
                                            {selectedTimeSlot.end.includes('T')
                                                ? selectedTimeSlot.end.split('T')[1].substring(0, 5)
                                                : selectedTimeSlot.end.split(' ')[1]
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* Confirm button - Yellow when enabled */}
                                <button
                                    className={`w-full rounded-lg py-2 text-white ${selectedTimeSlot ? 'bg-yellow hover:bg-yellow-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                    onClick={handleConfirmClick}
                                    disabled={!selectedTimeSlot}
                                >
                                    CONFIRM
                                </button>
                            </div>

                            {/* Right part - ScheduleX Calendar */}
                            <div className="lg:w-3/4">
                                {isLoading ? (
                                    <div className="min-h-[500px] flex justify-center items-center">
                                        <p>Loading calendar...</p>
                                    </div>
                                ) : (
                                    <div className="min-h-[500px] border rounded-lg">
                                        <div ref={calendarRef} style={{width: '100%', height: '500px'}}>
                                            {/* ScheduleX calendar will render here */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // List view layout
                        <div className='flex flex-col lg:flex-row gap-6'>
                            {/* Left part - Calendar */}
                            <div className="lg:w-1/3">
                                <Calendar
                                    onChange={handleMiniCalendarChange}
                                    value={selectedDate}
                                    locale="en-US"
                                    tileDisabled={tileDisabled}
                                    minDate={bookingStartDate}
                                    maxDate={bookingEndDate}
                                />

                                {/* Selected time slot display */}
                                {selectedTimeSlot && (
                                    <div className="mt-4 p-3 border-2 border-yellow rounded-lg text-pri">
                                        <p className="font-bold">Selected Time:</p>
                                        <p>{format(selectedDate, 'MMMM d, yyyy')}</p>
                                        <p>
                                            {selectedTimeSlot.start.includes('T')
                                                ? selectedTimeSlot.start.split('T')[1].substring(0, 5)
                                                : selectedTimeSlot.start.split(' ')[1]
                                            } -
                                            {selectedTimeSlot.end.includes('T')
                                                ? selectedTimeSlot.end.split('T')[1].substring(0, 5)
                                                : selectedTimeSlot.end.split(' ')[1]
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* Confirm button - Yellow when enabled */}
                                <button
                                    className={`w-full mt-4 rounded-lg py-2 text-white ${selectedTimeSlot ? 'bg-yellow hover:bg-yellow-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                    onClick={handleConfirmClick}
                                    disabled={!selectedTimeSlot}
                                >
                                    CONFIRM
                                </button>
                            </div>

                            {/* Right part - Time slots */}
                            <div className="lg:w-2/3">
                                <div className="border-1 border-pri rounded-lg p-4">
                                    <h2 className="text-xl font-bold text-pri mb-4">Available Time Slots</h2>

                                    {isLoading ? (
                                        <div className="h-64 flex justify-center items-center">
                                            <p>Loading time slots...</p>
                                        </div>
                                    ) : availableSlots.filter(slot => slot.isAvailable).length === 0 ? (
                                        <div className="h-64 flex justify-center items-center">
                                            <p>No available slots for the selected date.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {Object.keys(groupedTimeSlots).sort().map(hour => {
                                                const hourTime = parseInt(hour);
                                                const hourLabel = `${hourTime}:00`;

                                                return (
                                                    <div key={hour} className="mb-4">
                                                        <div className="font-medium text-pri">{hourLabel}</div>
                                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                                            {groupedTimeSlots[hour].map(slot => {
                                                                const startTime = slot.start.includes('T')
                                                                    ? slot.start.split('T')[1].substring(0, 5)
                                                                    : slot.start.split(' ')[1].substring(0, 5);

                                                                const endTime = slot.end.includes('T')
                                                                    ? slot.end.split('T')[1].substring(0, 5)
                                                                    : slot.end.split(' ')[1].substring(0, 5);

                                                                const isSelected = selectedTimeSlot && selectedTimeSlot.id === slot.id;

                                                                return (
                                                                    <button
                                                                        key={slot.id}
                                                                        className={`p-2 rounded text-pri ${isSelected ? 'bg-yellow text-white' : 'bg-yellow-100 hover:bg-yellow-200'}`}
                                                                        onClick={() => handleTimeSlotSelected(slot)}
                                                                    >
                                                                        {startTime} - {endTime}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Timeslot;