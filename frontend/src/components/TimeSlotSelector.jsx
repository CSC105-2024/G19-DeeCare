import React from 'react';

/**
 * TimeSlotSelector component for displaying available time slots in a list format
 *
 * @param {Object} props
 * @param {Array} props.availableSlots - Array of available time slots
 * @param {Object} props.selectedSlot - Currently selected time slot
 * @param {Function} props.onSlotSelect - Callback function when a slot is selected
 * @param {boolean} props.isLoading - Whether the slots are currently loading
 */
const TimeSlotSelector = ({ availableSlots, selectedSlot, onSlotSelect, isLoading }) => {
    // Helper function to get time part regardless of format
    const getTimePart = (dateTimeString) => {
        // Handle ISO format with T separator
        if (dateTimeString.includes('T')) {
            return dateTimeString.split('T')[1].substring(0, 5); // Get HH:MM
        }
        // Handle space-separated format
        return dateTimeString.split(' ')[1].substring(0, 5); // Get HH:MM
    };

    // Group time slots by hour
    const groupSlotsByHour = () => {
        const groupedSlots = {};

        availableSlots.forEach(slot => {
            if (!slot.isAvailable) return;

            const startTime = getTimePart(slot.start);
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
        <div className="p-4 bg-white rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>

            <div className="space-y-4">
                {sortedHours.map(hour => {
                    const hourTime = parseInt(hour);
                    const hourLabel = `${hourTime}:00`;

                    return (
                        <div key={hour} className="mb-4">
                            <div className="font-medium text-gray-700">{hourLabel}</div>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                {groupedSlots[hour].map(slot => {
                                    // Only show available slots
                                    if (!slot.isAvailable) return null;

                                    const isSelected = selectedSlot && selectedSlot.id === slot.id;
                                    const startTime = getTimePart(slot.start);
                                    const endTime = getTimePart(slot.end);

                                    return (
                                        <button
                                            key={slot.id}
                                            className={`p-2 rounded transition-colors duration-200
                                             ${isSelected
                                                ? 'bg-yellow text-white'
                                                : 'bg-yellow-100 hover:bg-yellow-200 text-gray-800'}`}
                                            onClick={() => onSlotSelect(slot)}
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
        </div>
    );
};

export default TimeSlotSelector;