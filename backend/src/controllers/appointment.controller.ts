import type {Context} from "hono";
import {Resend} from 'resend';
import {appointmentModel} from "../models/appointment.model.ts";
import {doctorModel} from "../models/doctor.model.js";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Define types for your models based on your Prisma schema
interface User {
    firstName: string;
    lastName: string;
    email: string;
}

interface Doctor {
    firstName: string;
    lastName: string;
    specialty: string;
}

interface Appointment {
    id: number;
    doctorId: number;
    userId: number;
    date: Date;
    status: string;
    User?: User;  // Note: uppercase 'User' to match your model
    doctor?: Doctor;
}

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

            // We need to fetch the appointment with User data for email
            const appointmentWithUser = await appointmentModel.findById(appointment.id);

            // Handle email notification if required
            if (sendEmailNotification && appointmentWithUser?.User?.email) {
                try {
                    await sendAppointmentConfirmationEmail({
                        patientEmail: appointmentWithUser.User.email,
                        patientName: `${appointmentWithUser.User.firstName} ${appointmentWithUser.User.lastName}`,
                        doctorName: `${appointment.doctor?.name}`,
                        doctorSpecialty: appointment.doctor?.specialization || 'General Practice',
                        appointmentDate: appointmentDate,
                        appointmentId: appointment.id
                    });

                    console.log(`Email notification sent successfully for appointment ${appointment.id}`);
                } catch (emailError) {
                    console.error("Failed to send email notification:", emailError);
                    // Don't fail the appointment creation if email fails
                }
            }

            return c.json({
                message: "Appointment created successfully",
                appointment,
                emailSent: sendEmailNotification && appointmentWithUser?.User?.email
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

            // Send cancellation email before deleting
            if (appointment.User?.email) {
                try {
                    await sendAppointmentCancellationEmail({
                        patientEmail: appointment.User.email,
                        patientName: `${appointment.User.firstName} ${appointment.User.lastName}`,
                        doctorName: `${appointment.doctor?.name}`,
                        appointmentDate: appointment.date,
                        appointmentId: appointment.id
                    });
                } catch (emailError) {
                    console.error("Failed to send cancellation email:", emailError);
                }
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

// Email utility functions
interface AppointmentConfirmationEmailData {
    patientEmail: string;
    patientName: string;
    doctorName: string;
    doctorSpecialty: string;
    appointmentDate: Date;
    appointmentId: number;
}

interface AppointmentCancellationEmailData {
    patientEmail: string;
    patientName: string;
    doctorName: string;
    appointmentDate: Date;
    appointmentId: number;
}

async function sendAppointmentConfirmationEmail(emailData: AppointmentConfirmationEmailData) {
    const {patientEmail, patientName, doctorName, doctorSpecialty, appointmentDate, appointmentId} = emailData;

    // Format the appointment date and time
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + 30);
    const formattedEndTime = endTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Appointment Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                .appointment-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff; }
                .doctor-info { background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
                .highlight { color: #007bff; font-weight: bold; }
                .time-info { font-size: 1.2em; font-weight: bold; color: #28a745; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏥 Appointment Confirmed!</h1>
                </div>
                <div class="content">
                    <p>Dear <strong>${patientName}</strong>,</p>
                    
                    <p>Your appointment has been successfully scheduled. Here are the details:</p>
                    
                    <div class="appointment-details">
                        <h3>📅 Appointment Details</h3>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p class="time-info"><strong>Time:</strong> ${formattedTime} - ${formattedEndTime}</p>
                        <p><strong>Appointment ID:</strong> #${appointmentId}</p>
                    </div>
                    
                    <div class="doctor-info">
                        <h3>👨‍⚕️ Doctor Information</h3>
                        <p><strong>Doctor:</strong> ${doctorName}</p>
                        <p><strong>Department:</strong> ${doctorSpecialty}</p>
                    </div>
                    
                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <h4>📋 Important Reminders:</h4>
                        <ul>
                            <li>Please arrive 15 minutes before your scheduled appointment time</li>
                            <li>Bring a valid ID and insurance card</li>
                            <li>If you need to reschedule or cancel, please contact us at least 24 hours in advance</li>
                            <li>Bring any relevant medical records or test results</li>
                        </ul>
                    </div>
                    
                    <p>If you have any questions or need to make changes to your appointment, please don't hesitate to contact us.</p>
                    
                    <p>We look forward to seeing you!</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>
                    <strong>Healthcare Appointment System</strong></p>
                    <p><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </body>
        </html>
    `;

    const {data, error} = await resend.emails.send({
        from: "Healthcare System <appointments@deecare.com>",
        to: [patientEmail],
        subject: `Appointment Confirmed - ${formattedDate} at ${formattedTime}`,
        html: emailHtml,
    });

    if (error) {
        throw new Error(`Failed to send confirmation email: ${error.message}`);
    }

    return data;
}

async function sendAppointmentCancellationEmail(emailData: AppointmentCancellationEmailData) {
    const {patientEmail, patientName, doctorName, appointmentDate, appointmentId} = emailData;

    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Appointment Cancelled</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                .appointment-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>❌ Appointment Cancelled</h1>
                </div>
                <div class="content">
                    <p>Dear <strong>${patientName}</strong>,</p>
                    
                    <p>Your appointment has been cancelled. Here were the original details:</p>
                    
                    <div class="appointment-details">
                        <h3>📅 Cancelled Appointment Details</h3>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Time:</strong> ${formattedTime}</p>
                        <p><strong>Doctor:</strong> ${doctorName}</p>
                        <p><strong>Appointment ID:</strong> #${appointmentId}</p>
                    </div>
                    
                    <p>If you would like to schedule a new appointment, please contact us or use our online booking system.</p>
                    
                    <p>We apologize for any inconvenience this may cause.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>
                    <strong>Healthcare Appointment System</strong></p>
                    <p><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </body>
        </html>
    `;

    const {data, error} = await resend.emails.send({
        from: 'Healthcare System <appointments@deecare.ttwrpz.xyz>',
        to: [patientEmail],
        subject: `Appointment Cancelled - ${formattedDate} at ${formattedTime}`,
        html: emailHtml,
    });

    if (error) {
        throw new Error(`Failed to send cancellation email: ${error.message}`);
    }

    return data;
}