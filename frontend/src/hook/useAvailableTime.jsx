// import { useState, useEffect } from 'react';
// import { format } from 'date-fns';
//
// const useAvailableTime = (initialDate) => {
//     const [selectedDate, setSelectedDate] = useState(initialDate);
//     const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
//     const [availableSlots, setAvailableSlots] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//
//     // Generate time slots for the selected date
//     useEffect(() => {
//         setIsLoading(true);
//
//         // Generate slots immediately (could be replaced with API call)
//         const newSlots = generateTimeSlots(selectedDate);
//         setAvailableSlots(newSlots);
//         setIsLoading(false);
//
//         // Clear selected time slot when date changes
//         setSelectedTimeSlot(null);
//     }, [selectedDate]);
//
//     const handleDateChange = (date) => {
//         setSelectedDate(date);
//     };
//
//     const handleTimeSlotSelected = (slot) => {
//         console.log("Time slot selected:", slot);
//         setSelectedTimeSlot(slot);
//     };
//
//     const saveBooking = (doctorInfo) => {
//         if (!selectedTimeSlot) return false;
//
//         //backend here
//         console.log('Booking saved:', {
//             date: format(selectedDate, 'yyyy-MM-dd'),
//             timeSlot: selectedTimeSlot,
//             doctor: doctorInfo
//         });
//
//         return true; // Indicate success
//     };
//
//     return {
//         selectedDate,
//         selectedTimeSlot,
//         availableSlots,
//         isLoading,
//         handleDateChange,
//         handleTimeSlotSelected,
//         saveBooking
//     };
// };
//
// // Helper function to generate time slots
// function generateTimeSlots(date) {
//     const slots = [];
//     const startHour = 8; // 8 AM
//     const endHour = 18; // 6 PM
//     const slotDuration = 30; // 30 minutes per slot
//
//     const dateStr = format(date, 'yyyy-MM-dd');
//
//     for (let hour = startHour; hour < endHour; hour++) {
//         for (let minute = 0; minute < 60; minute += slotDuration) {
//             const slotDate = new Date(date);
//             slotDate.setHours(hour, minute, 0, 0);
//
//             const endSlotDate = new Date(slotDate);
//             endSlotDate.setMinutes(endSlotDate.getMinutes() + slotDuration);
//
//             const start = `${dateStr}T${format(slotDate, 'HH:mm:ss')}`;
//             const end = `${dateStr}T${format(endSlotDate, 'HH:mm:ss')}`;
//
//             // Randomly determine if slot is available (for demo)
//             const isAvailable = Math.random() > 0.3; // 70% chance of being available
//
//             slots.push({
//                 id: `slot-${dateStr}-${hour}-${minute}`,
//                 title: `${format(slotDate, 'HH:mm')} - ${format(endSlotDate, 'HH:mm')}`,
//                 start,
//                 end,
//                 isAvailable,
//                 // Color based on availability
//                 color: isAvailable ? '#4CAF50' : '#F44336',
//                 backgroundColor: isAvailable ? '#FFD700' : '#F44336',
//                 // Make sure events are configured correctly for Schedule-X
//                 allDay: false,
//                 editable: false
//             });
//         }
//     }
//
//     return slots;
// }
//
// export default useAvailableTime;