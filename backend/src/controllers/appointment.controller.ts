import type {Context} from "hono";
import {appointmentModel} from "../models/appointment.model.ts";
import {doctorModel} from "../models/doctor.model.js";

export const appointmentController = {
    // Create a new appointment
    createAppointment: async (c: Context) => {
        try {
            const userId = c.get("userId");
            const {doctorId, date, sendEmailNotification} = await c.req.json();

            // Validate required fields
            if (!doctorId || !date) {
                return c.json({error: "Doctor ID and appointment date are required"}, 400);
            }

            // Parse the date string to a Date object
            const appointmentDate = new Date(date);

            // Check if the doctor exists
            const doctor = await doctorModel.findById(Number(doctorId));

            if (!doctor) {
                return c.json({error: "Doctor not found"}, 404);
            }

            // Check if the time slot is available
            const isAvailable = await appointmentModel.isTimeSlotAvailable(Number(doctorId), appointmentDate);

            if (!isAvailable) {
                return c.json({error: "This time slot is already booked"}, 409);
            }

            // Create the appointment
            const appointment = await appointmentModel.create({
                doctorId: Number(doctorId),
                userId: Number(userId),
                date: appointmentDate
            });

            // Handle email notification if required
            if (sendEmailNotification) {
                // In a real application, you would implement email sending logic here
                console.log(`Email notification will be sent for appointment ${appointment.id}`);
            }

            return c.json({
                message: "Appointment created successfully",
                appointment
            }, 201);
        } catch (error) {
            console.error("Error creating appointment:", error);
            return c.json({error: "Failed to create appointment"}, 500);
        }
    },

    // Delete an appointment
    deleteAppointment: async (c: Context) => {
        try {
            const userId = c.get("userId");
            const appointmentId = c.req.param("id");

            if (!appointmentId) {
                return c.json({error: "Appointment ID is required"}, 400);
            }

            // Find the appointment
            const appointment = await appointmentModel.findById(Number(appointmentId));

            if (!appointment) {
                return c.json({error: "Appointment not found"}, 404);
            }

            // Check if the user owns this appointment
            if (appointment.userId !== Number(userId)) {
                return c.json({error: "Unauthorized to delete this appointment"}, 403);
            }

            // Delete the appointment
            await appointmentModel.delete(Number(appointmentId));

            return c.json({message: "Appointment deleted successfully"}, 200);
        } catch (error) {
            console.error("Error deleting appointment:", error);
            return c.json({error: "Failed to delete appointment"}, 500);
        }
    },

    // Get user's appointments
    getUserAppointments: async (c: Context) => {
        try {
            const userId = c.get("userId");

            const appointments = await appointmentModel.findByUserId(Number(userId));

            return c.json({appointments}, 200);
        } catch (error) {
            console.error("Error fetching user appointments:", error);
            return c.json({error: "Failed to fetch appointments"}, 500);
        }
    }
};