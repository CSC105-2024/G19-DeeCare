import React from 'react';
import { format } from 'date-fns';

/**
 * TimeSlotSelector component for displaying available time slots in a grid
 *
 * @param {Object} props
 * @param {Array} props.availableSlots - Array of available time slots
 * @param {Object} props.selectedSlot - Currently selected time slot
 * @param {Function} props.onSlotSelect - Callback function when a slot is selected
 * @param {boolean} props.isLoading - Whether the slots are currently loading
 */
const TimeSlotSelector = ({ availableSlots, selectedSlot, onSlotSelect, isLoading }) => {
    // Group time slots by hour
    const groupSlotsByHour = () => {
        const groupedSlots = {};

        availableSlots.forEach(slot => {
            const startTime = slot.start.split(' ')[1]; // Get the time part (HH:MM)
            const hour = startTime.split(':')[0]; // Get the hour part

            if (!groupedSlots[hour]) {
                groupedSlots[hour] = [];
            }

            groupedSlots[hour].push(slot);
        });

        return groupedSlots;
    };

    const groupedSlots = groupSlotsByHour();

    // Sort hours for display
    const sortedHours = Object.keys(groupedSlots).sort();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow"></div>
            </div>
        );
    }

    if (availableSlots.length === 0) {
        return (
            <div className="p-6 bg-gray-100 rounded-lg text-center">
                <p className="text-lg">No available time slots for the selected date.</p>
                <p className="text-gray-600 mt-2">Please select another date or check back later.</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>

            <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
                {sortedHours.map(hour =>
                    groupedSlots[hour].map(slot => {
                        // Only show available slots
                        if (!slot.isAvailable) return null;

                        const isSelected = selectedSlot && selectedSlot.id === slot.id;
                        const startTime = slot.start.split(' ')[1];
                        const endTime = slot.end.split(' ')[1];

                        return (
                            <button
                                key={slot.id}
                                className={`py-2 px-4 rounded-lg transition-colors duration-200 text-center 
                                ${isSelected
                                    ? 'bg-yellow text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                                onClick={() => onSlotSelect(slot)}
                            >
                                {startTime} - {endTime}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TimeSlotSelector;