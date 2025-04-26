import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Calendar from 'react-calendar';
import '../styles/react-calendar.css';

import { ScheduleXCalendar } from '@schedule-x/react';
import { createCalendar, createViewWeek } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import '@schedule-x/theme-default/dist/index.css';
import { format, isWithinInterval } from 'date-fns';

// Import our custom hook and plugin
import useAvailableTime from '../hook/useAvailableTime.jsx';
import { AvailableTimePlugin } from '../plugin/AvailableTimePlugin.jsx';

function Timeslot() {
    const navigate = useNavigate();
    const calendarRef = useRef(null);

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

    useEffect(() => {
        // Only attempt to create calendar when we have slots and the plugin
        if (isLoading || !availableSlots.length) return;

        // Create our available time plugin if it doesn't exist
        if (!availableTimePluginRef.current) {
            availableTimePluginRef.current = new AvailableTimePlugin({
                onTimeSlotSelected: handleTimeSlotSelected,
                availableSlots: availableSlots,
                selectedDate: selectedDate
            });

            console.log("Created available time plugin with", availableSlots.length, "slots");
        } else {
            // Update plugin with new slots
            availableTimePluginRef.current.updateAvailableSlots(availableSlots);
            availableTimePluginRef.current.updateSelectedDate(selectedDate);
            console.log("Updated plugin with", availableSlots.length, "slots");
        }

        // Create plugins if they don't exist
        const eventsServicePlugin = createEventsServicePlugin();
        const eventModalPlugin = createEventModalPlugin();

        // Create or recreate calendar
        if (calendarAppRef.current) {
            calendarAppRef.current.destroy();
        }

        // Create calendar with updated plugins
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
            eventsServicePlugin,
            eventModalPlugin,
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
    }, [selectedDate, availableSlots, isLoading]);
    // // Create or recreate the calendar when needed
    // useEffect(() => {
    //     // Create plugins if they don't exist
    //     if (!eventsServicePluginRef.current) {
    //         eventsServicePluginRef.current = createEventsServicePlugin();
    //     }
    //     if (!eventModalPluginRef.current) {
    //         eventModalPluginRef.current = createEventModalPlugin();
    //     }
    //
    //     // Wait until the availableTimePlugin is initialized
    //     if (!availableTimePluginRef.current) return;
    //
    //     // Destroy existing calendar if it exists
    //     if (calendarAppRef.current) {
    //         calendarAppRef.current.destroy();
    //     }
    //
    //     // Create new calendar with updated date
    //     const calendarApp = createCalendar({
    //         views: [createViewWeek()],
    //         defaultView: 'week',
    //         dayBoundaries: {
    //             start: '08:00',
    //             end: '16:00',
    //         },
    //         isResponsive: true,
    //         initialDate: format(selectedDate, 'yyyy-MM-dd')
    //     }, [
    //         eventsServicePluginRef.current,
    //         eventModalPluginRef.current,
    //         availableTimePluginRef.current
    //     ]);
    //
    //     // Store ref to calendar app
    //     calendarAppRef.current = calendarApp;
    //
    //     // Render calendar if container exists
    //     if (calendarRef.current) {
    //         calendarAppRef.current.render(calendarRef.current);
    //
    //         // Log for debugging
    //         console.log("Calendar rendered with", availableSlots.length, "available slots");
    //     }
    //
    //     // Cleanup on unmount
    //     return () => {
    //         if (calendarAppRef.current) {
    //             calendarAppRef.current.destroy();
    //         }
    //     };
    // }, [selectedDate, availableTimePluginRef.current]);

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

    return (
        <>
            <div className="max-w-6xl mx-auto mt-4">
                {/* Doctor */}
                <div className="bg-light-blue rounded-2xl p-6 mb-6">
                    <div className="flex justify-start items-center">
                        <img src={doctorInfo.image}
                             alt={doctorInfo.name}
                             className="rounded-full w-[150px] mr-[64px]"
                        />
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
                    <p>Please select a date within this range and click on an available time slot.</p>
                </div>

                {/* Calendar layout */}
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

                        {/* Confirm button */}
                        <button
                            className={`w-full rounded-lg py-2 text-white ${selectedTimeSlot ? 'bg-yellow hover:bg-yellow-600' : 'bg-gray-300 cursor-not-allowed'}`}
                            onClick={handleConfirmClick}
                            disabled={!selectedTimeSlot}
                        >
                            CONFIRM
                        </button>
                    </div>

                    {/* Right part - Schedule-X Calendar */}
                    <div className="lg:w-3/4">
                        {isLoading ? (
                            <div className="min-h-[500px] flex justify-center items-center">
                                <p>Loading calendar...</p>
                            </div>
                        ) : (
                            <div className="min-h-[500px] border rounded-lg">
                                <div ref={calendarRef} style={{ width: '100%', height: '500px' }}>
                                    {/* ScheduleX calendar will render here */}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 text-sm">
                    <p>Available Slots: {availableSlots.length}</p>
                </div>
            </div>
        </>
    );
}

export default Timeslot;