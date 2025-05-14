import type {Context} from "hono";
import {doctorModel} from "../models/doctor.model.js";

export const doctorController = {
    // Get all doctors
    getAllDoctors: async (c: Context) => {
        try {
            const doctors = await doctorModel.findAll();
            return c.json({doctors}, 200);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            return c.json({error: "Failed to fetch doctors"}, 500);
        }
    },

    // Get doctor by ID
    getDoctorById: async (c: Context) => {
        try {
            const doctorId = c.req.param("id");

            if (!doctorId) {
                return c.json({error: "Doctor ID is required"}, 400);
            }

            const doctor = await doctorModel.findById(Number(doctorId));

            if (!doctor) {
                return c.json({error: "Doctor not found"}, 404);
            }

            return c.json({doctor}, 200);
        } catch (error) {
            console.error("Error fetching doctor:", error);
            return c.json({error: "Failed to fetch doctor"}, 500);
        }
    },

    // Get available time slots for a doctor
    getDoctorAvailability: async (c: Context) => {
        try {
            const doctorId = c.req.param("id");
            const {date} = c.req.query();

            if (!doctorId || !date) {
                return c.json({error: "Doctor ID and date are required"}, 400);
            }

            const availableSlots = await doctorModel.getAvailableTimeSlots(
                Number(doctorId),
                new Date(date)
            );

            return c.json({availableSlots}, 200);
        } catch (error) {
            console.error("Error fetching doctor availability:", error);
            return c.json({error: "Failed to fetch doctor availability"}, 500);
        }
    }
};