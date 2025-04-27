import { useState, useEffect } from 'react';
import { format, isWithinInterval, parseISO } from 'date-fns';
import calendar from "daisyui/components/calendar/index.js";

calendar.plugins.eventModalPlugin = undefined;
/**
 * Custom plugin to manage available time slots for booking
 * @param {Object} props - Component props
 * @param {Object} props.calendar - schedule-x calendar instance
 * @param {Function} props.onTimeSlotSelected - Callback when time slot is selected
 * @param {Array} props.availableSlots - Array of available time slots
 * @param {Date} props.selectedDate - Currently selected date
 */
const AvailableTime = ({ calendar, onTimeSlotSelected, availableSlots = [], selectedDate }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);

    const isDateInBookingPeriod = (date) => {
        const startDate = new Date(2025, 3, 28);
        const endDate = new Date(2025, 8, 16);

        return isWithinInterval(date, { start: startDate, end: endDate });
    };

    // Filter available slots based on booking period
    const getFilteredSlots = () => {
        if (!selectedDate || !isDateInBookingPeriod(selectedDate)) {
            return [];
        }

        const formattedDate = format(selectedDate, 'yyyy-MM-dd');

        return availableSlots.filter(slot =>
            slot.start.startsWith(formattedDate) &&
            slot.isAvailable
        );
    };

    // Initialize plugin when calendar or available slots change
    useEffect(() => {
        if (!calendar || !availableSlots.length) return;

        // Add event click handler using the event modal plugin
        if (calendar.plugins && calendar.plugins.eventModalPlugin) {
            // Override the onEventClick method of the eventModalPlugin
            const originalOnEventClick = calendar.plugins.eventModalPlugin.onEventClick;

            calendar.plugins.eventModalPlugin.onEventClick = (eventId) => {
                // Call the original handler if it exists
                if (originalOnEventClick) {
                    originalOnEventClick(eventId);
                }

                // Handle our custom logic
                const clickedSlot = availableSlots.find(slot => slot.id === eventId);
                if (clickedSlot && clickedSlot.isAvailable) {
                    setSelectedSlot(clickedSlot);
                    if (typeof onTimeSlotSelected === 'function') {
                        onTimeSlotSelected(clickedSlot);
                    }
                }
            };

            // Clean up when component unmounts
            return () => {
                calendar.plugins.eventModalPlugin.onEventClick = originalOnEventClick;
            };
        } else {
            console.warn('Event modal plugin not found in calendar instance');
        }
    }, [calendar, availableSlots, onTimeSlotSelected]);

    // Load available slots when date changes
    useEffect(() => {
        if (!calendar || !selectedDate) return;

        // Check if date is within booking period
        if (!isDateInBookingPeriod(selectedDate)) {
            // If outside booking period, clear events
            if (calendar.setEvents) {
                calendar.setEvents([]);
            }

            // Clear selection
            setSelectedSlot(null);
            if (typeof onTimeSlotSelected === 'function') {
                onTimeSlotSelected(null);
            }
            return;
        }

        // Get filtered slots for the selected date
        const filteredSlots = getFilteredSlots();

        // Update calendar events
        if (calendar.setEvents) {
            calendar.setEvents(filteredSlots);
        } else if (calendar.calendarState && calendar.calendarState.events) {
            // Alternative approach if setEvents is not available
            calendar.calendarState.events.value = filteredSlots;
        }

        // Clear selection when date changes
        setSelectedSlot(null);
        if (typeof onTimeSlotSelected === 'function') {
            onTimeSlotSelected(null);
        }

    }, [selectedDate, availableSlots, calendar, onTimeSlotSelected]);

    // Pure component - no visible UI elements
    return null;
};

export default AvailableTime;