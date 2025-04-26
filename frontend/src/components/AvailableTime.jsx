import { useState, useEffect } from 'react';
import { format } from 'date-fns';

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

    // Initialize plugin when calendar or available slots change
    useEffect(() => {
        if (!calendar || !availableSlots.length) return;

        // Add event click handler using the event modal plugin
        // For schedule-x, we need to access the eventModalPlugin instead of using .on() directly

        // Check if the event modal plugin is available in the calendar instance
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
                    onTimeSlotSelected(clickedSlot);
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

        // Set events to available slots for the selected date
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');

        // Filter slots for the selected date
        const slotsForDate = availableSlots.filter(slot =>
            slot.start.startsWith(formattedDate)
        );

        // Update calendar events
        if (calendar.setEvents) {
            calendar.setEvents(slotsForDate);
        } else if (calendar.calendarState && calendar.calendarState.events) {
            // Alternative approach if setEvents is not available
            calendar.calendarState.events.value = slotsForDate;
        }

        // Clear selection when date changes
        setSelectedSlot(null);
        onTimeSlotSelected(null);

    }, [selectedDate, availableSlots, calendar, onTimeSlotSelected]);

    // Pure component - no visible UI elements
    return null;
};

export default AvailableTime;