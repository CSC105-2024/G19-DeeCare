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
                email: true,
                image: true,
                workHours: true
            }
        });
    },

    /**
     * Find a doctor by ID
     */
    findById: async (id: number) => {
        return db.doctor.findUnique({
            where: {id},
            select: {
                id: true,
                firstName: true,
                lastName: true,
                specialty: true,
                email: true,
                image: true,
                workHours: true
            }
        });
    },

    /**
     * Get available time slots for a doctor on a specific date
     * This generates 30-minute slots during work hours and excludes booked appointments
     */
    getAvailableTimeSlots: async (doctorId: number, date: Date): Promise<string[]> => {
        try {
            // Get the start and end of the specified date
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

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
                select: {
                    date: true
                }
            });

            // Get doctor's work hours (default to 8:00-18:00 if not specified)
            const doctor = await db.doctor.findUnique({
                where: {id: doctorId},
                select: {workHours: true}
            });

            // Parse work hours or use default
            let workStartHour = 8;
            let workEndHour = 18;

            if (doctor?.workHours) {
                // Assuming workHours format is "8:00-18:00" or similar
                const workHoursParts = doctor.workHours.split('-');
                if (workHoursParts.length === 2) {
                    workStartHour = parseInt(workHoursParts[0].split(':')[0]);
                    workEndHour = parseInt(workHoursParts[1].split(':')[0]);
                }
            }

            // Generate all possible 30-minute time slots during work hours
            const allTimeSlots: string[] = [];
            for (let hour = workStartHour; hour < workEndHour; hour++) {
                allTimeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
                allTimeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
            }

            // Convert scheduled appointments to time strings for comparison
            const bookedTimeSlots = scheduledAppointments.map(appointment => {
                const appointmentDate = new Date(appointment.date);
                const hours = appointmentDate.getHours().toString().padStart(2, '0');
                const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            });

            // Filter out booked time slots and past time slots for today
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();

            const availableSlots = allTimeSlots.filter(timeSlot => {
                // Check if slot is booked
                if (bookedTimeSlots.includes(timeSlot)) {
                    return false;
                }

                // If it's today, filter out past time slots
                if (isToday) {
                    const [hours, minutes] = timeSlot.split(':').map(Number);
                    const slotTime = new Date(date);
                    slotTime.setHours(hours, minutes, 0, 0);

                    // Add 30 minutes buffer for booking
                    const bufferTime = new Date(now);
                    bufferTime.setMinutes(bufferTime.getMinutes() + 30);

                    if (slotTime <= bufferTime) {
                        return false;
                    }
                }

                return true;
            });

            return availableSlots;
        } catch (error) {
            console.error('Error getting available time slots:', error);
            return [];
        }
    },

    /**
     * Check if a specific time slot is available for a doctor
     */
    isTimeSlotAvailable: async (doctorId: number, date: Date): Promise<boolean> => {
        try {
            // Check if there's already an appointment at this exact time
            const existingAppointment = await db.appointment.findFirst({
                where: {
                    doctorId,
                    date: date,
                    status: "scheduled"
                }
            });

            if (existingAppointment) {
                return false;
            }

            // Check if the time slot overlaps with any existing appointment (within 30 minutes)
            const startTime = new Date(date);
            const endTime = new Date(date);
            endTime.setMinutes(endTime.getMinutes() + 30);

            // Check for appointments that would overlap
            const overlappingAppointment = await db.appointment.findFirst({
                where: {
                    doctorId,
                    status: "scheduled",
                    date: {
                        gte: new Date(date.getTime() - 29 * 60 * 1000), // 29 minutes before
                        lt: endTime // 30 minutes after
                    }
                }
            });

            return !overlappingAppointment;
        } catch (error) {
            console.error('Error checking time slot availability:', error);
            return false;
        }
    },

    /**
     * Get doctor's work schedule for a date range
     */
    getDoctorSchedule: async (doctorId: number, startDate: Date, endDate: Date) => {
        try {
            const appointments = await db.appointment.findMany({
                where: {
                    doctorId,
                    date: {
                        gte: startDate,
                        lte: endDate
                    },
                    status: "scheduled"
                },
                include: {
                    User: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    date: 'asc'
                }
            });

            return appointments;
        } catch (error) {
            console.error('Error getting doctor schedule:', error);
            return [];
        }
    },

    /**
     * Get doctor statistics
     */
    getDoctorStats: async (doctorId: number) => {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const [
                totalAppointments,
                monthlyAppointments,
                upcomingAppointments
            ] = await Promise.all([
                db.appointment.count({
                    where: {
                        doctorId,
                        status: "scheduled"
                    }
                }),
                db.appointment.count({
                    where: {
                        doctorId,
                        status: "scheduled",
                        date: {
                            gte: startOfMonth,
                            lte: endOfMonth
                        }
                    }
                }),
                db.appointment.count({
                    where: {
                        doctorId,
                        status: "scheduled",
                        date: {
                            gte: now
                        }
                    }
                })
            ]);

            return {
                totalAppointments,
                monthlyAppointments,
                upcomingAppointments
            };
        } catch (error) {
            console.error('Error getting doctor stats:', error);
            return {
                totalAppointments: 0,
                monthlyAppointments: 0,
                upcomingAppointments: 0
            };
        }
    }
};