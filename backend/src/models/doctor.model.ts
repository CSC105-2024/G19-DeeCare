import {db} from "../index.js";

export const doctorModel = {
    /**
     * Get all doctors
     */
    findAll: async () => {
        return db.doctor.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                specialty: true,
                email: true
            }
        });
    },

    /**
     * Find a doctor by ID
     */
    findById: async (id: number) => {
        return db.doctor.findUnique({
            where: {id},
            include: {
                availableTimes: true
            }
        });
    },

    /**
     * Get available time slots for a doctor
     */
    getAvailableTimeSlots: async (doctorId: number, date: Date) => {
        // Get the start and end of the specified date
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Get all available time slots for the doctor on that date
        const availableTimes = await db.availableTime.findMany({
            where: {
                doctorId,
                startTime: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        // Get all scheduled appointments for the doctor on that date
        const scheduledAppointments = await db.appointment.findMany({
            where: {
                doctorId,
                date: {
                    gte: startDate,
                    lte: endDate
                },
                status: "scheduled"
            },
            orderBy: {
                date: 'asc'
            }
        });

        // Filter out time slots that have appointments
        return availableTimes.filter(timeSlot => {
            // Check if there's an appointment that overlaps with this time slot
            return !scheduledAppointments.some(appointment => {
                const appointmentTime = new Date(appointment.date);
                return (
                    appointmentTime >= timeSlot.startTime &&
                    appointmentTime < timeSlot.endTime
                );
            });
        });
    },

    /**
     * Create available time slots for a doctor
     */
    createAvailableTimeSlot: async (data: {
        doctorId: number;
        startTime: Date;
        endTime: Date;
    }) => {
        return db.availableTime.create({
            data: {
                doctorId: data.doctorId,
                startTime: data.startTime,
                endTime: data.endTime
            }
        });
    }
};