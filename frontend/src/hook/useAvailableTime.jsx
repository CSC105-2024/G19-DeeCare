import { useState, useEffect } from 'react';
import { format } from 'date-fns';

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

    // Fetch available slots for the selected date
    const fetchAvailableSlots = async (date) => {
        setIsLoading(true);
        try {
            // Replace this with your actual API call
            // For now, we'll simulate with sample data
            const formattedDate = format(date, 'yyyy-MM-dd');

            // Simulated API response (replace with actual API call)
            // In a real implementation, you would fetch this from your backend
            const sampleSlots = [
                {
                    id: `slot-${formattedDate}-1`,
                    title: 'Available',
                    start: `${formattedDate} 08:00`,
                    end: `${formattedDate} 09:00`,
                    color: '#f9a825', // Orange color
                    editable: false,
                    isAvailable: true
                },
                {
                    id: `slot-${formattedDate}-2`,
                    title: 'Available',
                    start: `${formattedDate} 09:00`,
                    end: `${formattedDate} 10:00`,
                    color: '#f9a825',
                    editable: false,
                    isAvailable: true
                },
                {
                    id: `slot-${formattedDate}-3`,
                    title: 'Available',
                    start: `${formattedDate} 10:00`,
                    end: `${formattedDate} 11:00`,
                    color: '#f9a825',
                    editable: false,
                    isAvailable: true
                }
            ];

            setAvailableSlots(sampleSlots);
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
        setSelectedTimeSlot(slot);
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