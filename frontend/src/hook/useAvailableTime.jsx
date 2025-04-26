import { useState, useEffect } from 'react';
import { format, parseISO, addDays } from 'date-fns';

/**
 * Custom hook to manage available time slots
 * @param {Date} initialDate - Initial selected date
 * @returns {Object} - State and methods for managing available time slots
 */
const useAvailableTime = (initialDate = new Date()) => {
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Generate slots for a specific date
    const generateSlotsForDate = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const slots = [];

        // Create time slots from 8:00 to 17:00 with 1-hour intervals
        for (let hour = 8; hour < 17; hour++) {
            // Format hours with leading zeros
            const startHour = hour.toString().padStart(2, '0');
            const endHour = (hour + 1).toString().padStart(2, '0');

            // Randomly determine if slot is available (80% chance)
            const isAvailable = Math.random() < 0.8;

            slots.push({
                id: `slot-${formattedDate}-${hour}`,
                title: isAvailable ? 'Available' : 'Booked',
                start: `${formattedDate} ${startHour}:00`,
                end: `${formattedDate} ${endHour}:00`,
                color: isAvailable ? '#f9a825' : '#cccccc', // Orange for available, gray for booked
                editable: false,
                isAvailable: isAvailable
            });
        }

        return slots;
    };

    // Fetch available slots for the selected date
    const fetchAvailableSlots = async (date) => {
        setIsLoading(true);
        try {
            // In a real app, this would be an API call
            // For this example, we're generating mock data

            // Add a small delay to simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            // Generate slots for the selected date
            const slots = generateSlotsForDate(date);

            setAvailableSlots(slots);
        } catch (error) {
            console.error('Error fetching available slots:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Change selected date and fetch available slots
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTimeSlot(null);
    };

    // Handle time slot selection
    const handleTimeSlotSelected = (slot) => {
        // Only allow selecting available slots
        if (slot && slot.isAvailable) {
            setSelectedTimeSlot(slot);
        } else if (!slot) {
            setSelectedTimeSlot(null);
        }
    };

    // Store selected booking in session storage
    const saveBooking = (doctorInfo) => {
        if (!selectedTimeSlot) return false;

        const bookingData = {
            date: format(selectedDate, 'yyyy-MM-dd'),
            startTime: selectedTimeSlot.start.split(' ')[1],
            endTime: selectedTimeSlot.end.split(' ')[1],
            doctorName: doctorInfo.name || 'Unknown Doctor',
            department: doctorInfo.department || 'General',
            slotId: selectedTimeSlot.id
        };

        sessionStorage.setItem('selectedBooking', JSON.stringify(bookingData));
        return true;
    };

    // Load available slots when date changes
    useEffect(() => {
        fetchAvailableSlots(selectedDate);
    }, [selectedDate]);

    return {
        selectedDate,
        selectedTimeSlot,
        availableSlots,
        isLoading,
        handleDateChange,
        handleTimeSlotSelected,
        saveBooking
    };
};

export default useAvailableTime;