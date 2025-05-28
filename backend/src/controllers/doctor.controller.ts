import type {Context} from "hono";
import {doctorModel} from "../models/doctor.model.js";
import {db} from "../index.js";

export const doctorController = {
    // Get all doctors


    deleteDoc: async (c: Context) => {
        try {
            const id = await c.req.param('id')
            if (!id) {
                return c.json({error: "id is required"}, 404);
            }
            const deleteDoc = await doctorModel.DeleteDoctor(parseInt(id));
            return c.json({
                success: true,
                msg: "Delete success!",
            });
        } catch (e) {
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: `Internal Server Error : ${e}`,
                },
                500
            );
        }
    },

    getAllDoctors: async (c: Context) => {
        try {
            const doctors = await doctorModel.findAllDoc();
            return c.json({
                success: true,
                data: doctors,
                msg: "Doctor in this department!",
            });
        } catch (error) {
            console.error("Error fetching doctor:", error);
            return c.json({error: "Failed to fetch doctor"}, 500);
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

    getDocbyDepartment: async (c: Context) => {
        try {
            const department = await c.req.param('department')
            if (!department) {
                return c.json({error: "department is required"}, 404);
            }
            const getDocDE = await doctorModel.findByde(department);
            return c.json({
                success: true,
                data: getDocDE,
                msg: "Doctor in this department!",
            });
        } catch (e) {
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: `Internal Server Error : ${e}`,
                },
                500
            );
        }
    },

    getDocbySearch: async (c: Context) => {
        try {
            const name = await c.req.param('name')
            if (!name) {
                return c.json({error: "department is required"}, 404);
            }
            const getDocname = await doctorModel.findBySearch(name);
            return c.json({
                success: true,
                data: getDocname,
                msg: "Doctor in this department!",
            });
        } catch (e) {
            return c.json(
                {
                    success: false,
                    data: null,
                    msg: `Internal Server Error : ${e}`,
                },
                500
            );
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