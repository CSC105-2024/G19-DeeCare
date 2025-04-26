// AvailableTimePlugin.jsx - Debug version
import { format } from 'date-fns';

export class AvailableTimePlugin {
    constructor(options = {}) {
        this.name = "available-time-plugin";
        this.$app = null;
        this.availableSlots = [];
        this.selectedDate = new Date();
        this.onTimeSlotSelected = null;
        this.initialized = false;

        console.log("AvailableTimePlugin constructor", options);
        this.onTimeSlotSelected = options.onTimeSlotSelected || (() => {});
        this.availableSlots = options.availableSlots || [];
        this.selectedDate = options.selectedDate || new Date();
    }

    onInitialize($app) {
        console.log("AvailableTimePlugin onInitialize called", $app);
        this.$app = $app;
        this.initialized = true;

        if (!$app.eventsServicePlugin) {
            console.error("AvailableTimePlugin: eventsServicePlugin is not available in the app");
            return;
        }

        this.updateEvents();
        this.setupEventListeners();
        console.log("AvailableTimePlugin initialized successfully");
    }

    onRender() {
        console.log("AvailableTimePlugin onRender called");
        if (!this.initialized && this.$app) {
            this.updateEvents();
        }
    }

    setupEventListeners() {
        if (!this.$app || !this.$app.elements || !this.$app.elements.calendarWrapper) {
            console.error("AvailableTimePlugin: Cannot set up event listeners, app elements not available");
            return;
        }

        const calendarWrapper = this.$app.elements.calendarWrapper;

        // Remove any existing listeners
        calendarWrapper.removeEventListener('click', this.handleEventClick);

        // Add click event listener
        calendarWrapper.addEventListener('click', this.handleEventClick);

        console.log("AvailableTimePlugin: Event listeners set up");
    }

    handleEventClick = (e) => {
        const eventElement = e.target.closest('.sx__event');
        if (!eventElement) return;

        const eventId = eventElement.getAttribute('data-event-id');
        console.log("AvailableTimePlugin: Event clicked", eventId);

        if (!eventId) return;

        const clickedSlot = this.availableSlots.find(slot =>
            String(slot.id) === String(eventId)
        );

        console.log("AvailableTimePlugin: Found slot?", clickedSlot);

        if (clickedSlot && clickedSlot.isAvailable) {
            console.log("AvailableTimePlugin: Triggering slot selection", clickedSlot);
            this.onTimeSlotSelected(clickedSlot);
        }
    }

    updateEvents() {
        console.log("AvailableTimePlugin: updateEvents called");

        if (!this.$app) {
            console.error("AvailableTimePlugin: App not available");
            return;
        }

        if (!this.$app.eventsServicePlugin) {
            console.error("AvailableTimePlugin: eventsServicePlugin not available");
            return;
        }

        const formattedDate = format(this.selectedDate, 'yyyy-MM-dd');
        console.log("AvailableTimePlugin: Selected date", formattedDate);
        console.log("AvailableTimePlugin: Available slots", this.availableSlots);

        const events = this.availableSlots.map(slot => {
            const start = this.ensureCorrectDateFormat(slot.start);
            const end = this.ensureCorrectDateFormat(slot.end);

            return {
                id: slot.id,
                start: start,
                end: end,
                title: slot.title || `${start.split(' ')[1]} - ${end.split(' ')[1]}`,
                color: slot.isAvailable ? '#4caf50' : '#9e9e9e',
                meta: {
                    isAvailable: slot.isAvailable,
                    originalSlot: slot
                }
            };
        });

        console.log("AvailableTimePlugin: Formatted events for calendar", events);

        try {
            this.$app.eventsServicePlugin.setEvents(events);
            console.log("AvailableTimePlugin: Events set successfully");

            if (this.$app.refreshCalendarView) {
                this.$app.refreshCalendarView();
                console.log("AvailableTimePlugin: Calendar view refreshed");
            }
        } catch (error) {
            console.error("AvailableTimePlugin: Error setting events", error);
        }
    }

    ensureCorrectDateFormat(dateValue) {
        console.log("AvailableTimePlugin: Formatting date", dateValue);

        if (!dateValue) return '';

        try {
            let formattedDate;

            if (typeof dateValue === 'string') {
                if (dateValue.includes('T')) {
                    const date = new Date(dateValue);
                    formattedDate = format(date, 'yyyy-MM-dd HH:mm');
                } else if (dateValue.includes('-') && dateValue.includes(':')) {
                    formattedDate = dateValue;
                } else {
                    const date = new Date(dateValue);
                    formattedDate = format(date, 'yyyy-MM-dd HH:mm');
                }
            } else if (dateValue instanceof Date) {
                formattedDate = format(dateValue, 'yyyy-MM-dd HH:mm');
            } else {
                console.error("AvailableTimePlugin: Unsupported date format", dateValue);
                return '';
            }

            console.log("AvailableTimePlugin: Formatted date result", formattedDate);
            return formattedDate;
        } catch (error) {
            console.error("AvailableTimePlugin: Error formatting date", error);
            return '';
        }
    }

    updateAvailableSlots(slots) {
        console.log("AvailableTimePlugin: updateAvailableSlots", slots?.length);
        this.availableSlots = slots || [];
        if (this.$app) {
            this.updateEvents();
        }
        return this;
    }

    updateSelectedDate(date) {
        console.log("AvailableTimePlugin: updateSelectedDate", date);
        this.selectedDate = date || new Date();
        if (this.$app) {
            this.updateEvents();
        }
        return this;
    }

    updateOnTimeSlotSelected(callback) {
        console.log("AvailableTimePlugin: updateOnTimeSlotSelected", callback);
        this.onTimeSlotSelected = callback || (() => {});
        return this;
    }

    destroy() {
        if (this.$app && this.$app.elements && this.$app.elements.calendarWrapper) {
            this.$app.elements.calendarWrapper.removeEventListener('click', this.handleEventClick);
        }
    }
}
