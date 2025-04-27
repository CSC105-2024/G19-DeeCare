/**
 * Plugin for Schedule-X to manage available time slots
 */
export class AvailableTimePlugin {
    /**
     * @param {Object} options
     * @param {Function} options.onTimeSlotSelected - Callback when a slot is selected
     * @param {Array} options.availableSlots - Available time slots
     * @param {Date} options.selectedDate - Currently selected date
     */
    constructor(options) {
        this.name = 'availableTimePlugin';
        this.onTimeSlotSelected = options.onTimeSlotSelected;
        this.availableSlots = options.availableSlots || [];
        this.selectedDate = options.selectedDate;
        this.calendar = null;
    }

    /**
     * Initialize the plugin - called by Schedule-X
     * @param {Object} calendar - The Schedule-X calendar instance
     */
    onInitialize(calendar) {
        this.calendar = calendar;

        // Set events in the calendar if we have slots
        if (this.availableSlots && this.availableSlots.length > 0) {
            if (calendar.setEvents) {
                calendar.setEvents(this.availableSlots);
            } else if (calendar.calendarState && calendar.calendarState.events) {
                calendar.calendarState.events.value = this.availableSlots;
            }
        }

        // Register for event click events
        if (calendar.plugins && calendar.plugins.eventModalPlugin) {
            const originalOnEventClick = calendar.plugins.eventModalPlugin.onEventClick;

            calendar.plugins.eventModalPlugin.onEventClick = (eventId) => {
                // Call original handler if exists
                if (originalOnEventClick) {
                    originalOnEventClick(eventId);
                }

                // Handle our custom logic
                const clickedSlot = this.availableSlots.find(slot => slot.id === eventId);
                if (clickedSlot && clickedSlot.isAvailable) {
                    if (typeof this.onTimeSlotSelected === 'function') {
                        this.onTimeSlotSelected(clickedSlot);
                    }
                }
            };
        }
    }

    /**
     * Update available slots
     * @param {Array} slots - New available slots
     */
    updateAvailableSlots(slots) {
        this.availableSlots = slots || [];

        if (this.calendar) {
            if (this.calendar.setEvents) {
                this.calendar.setEvents(this.availableSlots);
            } else if (this.calendar.calendarState && this.calendar.calendarState.events) {
                this.calendar.calendarState.events.value = this.availableSlots;
            }
        }
    }

    /**
     * Update selected date
     * @param {Date} date - New selected date
     */
    updateSelectedDate(date) {
        this.selectedDate = date;

        if (this.calendar && this.calendar.setDate) {
            this.calendar.setDate(date);
        }
    }
}