import {db} from "../index.js"

export const appointmentModel = {
    /**
     * Create a new appointment
     */
    create: async (data: {
        doctorId: number;
        userId: number;
        date: Date;
        status?: string;
    }) => {
        return db.appointment.create({
            data: {
                doctorId: data.doctorId,
                userId: data.userId,
                date: data.date,
                status: data.status || "scheduled"
            },
            include: {
                doctor: {
                    select: {
                        name: true,
                        specialization: true
                    }
                }
            }
        });
    },

    /**
     * Find an appointment by ID
     */
    findById: async (id: number) => {
        return db.appointment.findUnique({
            where: {id},
            include: {
                doctor: {
                    select: {
                        name: true,
                        specialization: true
                    }
                },
                User: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
    },

    /**
     * Find appointments by user ID
     */
    findByUserId: async (userId: number) => {
        return db.appointment.findMany({
            where: {userId},
            include: {
                doctor: {
                    select: {
                        name: true,
                        specialization: true
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
    },

    /**
     * Find appointments by doctor ID
     */
    findByDoctorId: async (doctorId: number) => {
        return db.appointment.findMany({
            where: {doctorId},
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
    },

    /**
     * Check if a time slot is available
     */
    isTimeSlotAvailable: async (doctorId: number, date: Date) => {
        // Find any overlapping appointments within 30 minutes
        const startTime = new Date(date);
        const endTime = new Date(date);
        endTime.setMinutes(endTime.getMinutes() + 30);

        const overlappingAppointment = await db.appointment.findFirst({
            where: {
                doctorId,
                status: "scheduled",
                date: {
                    gte: startTime,
                    lt: endTime
                }
            }
        });

        return !overlappingAppointment;
    },

    /**
     * Delete an appointment
     */
    delete: async (id: number) => {
        return db.appointment.delete({
            where: {id}
        });
    },

    /**
     * Update appointment status
     */
    updateStatus: async (id: number, status: string) => {
        return db.appointment.update({
            where: {id},
            data: {status}
        });
    }
};