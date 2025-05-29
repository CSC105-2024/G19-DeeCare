import type {Context} from 'hono'
import * as eventModel from '../models/event.model.ts'
import {db} from '../index.ts'

const createEvent = async (c: Context) => {
    try {
        // Handle JSON instead of FormData
        const eventData = await c.req.json();

        console.log('Received event data:', eventData);

        // Validate required fields
        const requiredFields = ['name', 'eventDates', 'day', 'month', 'place', 'organizer', 'phone', 'email', 'description'];
        const missingFields = requiredFields.filter(field => !eventData[field] || eventData[field].trim() === '');

        if (missingFields.length > 0) {
            return c.json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, 400);
        }

        // Create event in database
        const newEvent = await db.event.create({
            data: {
                name: eventData.name,
                eventDates: eventData.eventDates,
                day: eventData.day,
                month: eventData.month,
                image: eventData.image || null,
                place: eventData.place,
                website: eventData.website || null,
                organizer: eventData.organizer,
                phone: eventData.phone,
                email: eventData.email,
                linkedin: eventData.linkedin || null,
                description: eventData.description,
            }
        });

        return c.json({
            success: true,
            message: 'Event created successfully',
            data: newEvent
        }, 201);

    } catch (error) {
        console.error('Error creating event:', error);
        return c.json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
};

const read1Event = async (c: Context) => {
    try {
        const param = parseInt(c.req.param('id'));
        if (isNaN(param)) {
            return c.json({
                success: false,
                data: null,
                msg: "Invalid event ID",
            }, 400);
        }
        const event = await eventModel.read1Event(param);
        if (!event) {
            return c.json({
                success: false,
                data: null,
                msg: "Event not found"
            });
        } else {
            return c.json({
                success: true,
                data: event,
                msg: "Found Event data"
            })
        }
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
}

const readAllEvent = async (c: Context) => {
    try {
        const event = await eventModel.readAllEvent();
        if (!event || event.length === 0) {
            return c.json({
                success: false,
                data: null,
                msg: "Event not found"
            });
        } else {
            return c.json({
                success: true,
                data: event,
                msg: "Found Event data"
            });
        }
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
}

const updateEvent = async (c: Context) => {
    try {
        const eventId = parseInt(c.req.param('id'));
        const body = await c.req.json();
        if (!body || isNaN(eventId)) {
            return c.json({
                success: false,
                data: null,
                msg: "Invalid event data or event ID",
            }, 400);
        }
        const updatedEvent = await eventModel.UpdatedEventDetails(eventId, body);
        return c.json({
            success: true,
            data: updatedEvent,
            msg: "Event updated successfully",
        });
    } catch (e) {
        return c.json(
            {
                success: false,
                data: null,
                msg: `Internal Server Error: ${e}`,
            },
            500
        );
    }
};

const deleteEvent = async (c: Context) => {
    try {
        const eventId = parseInt(c.req.param('id'));
        if (isNaN(eventId)) {
            return c.json({
                success: false,
                data: null,
                msg: "Invalid event ID",
            }, 400);
        }
        const deletedEvent = await eventModel.deletedEvent(eventId);
        return c.json({
            success: true,
            data: deletedEvent,
            msg: "Event deleted successfully",
        });
    } catch (e) {
        return c.json(
            {
                success: false,
                data: null,
                msg: `Internal Server Error: ${e}`,
            },
            500
        );
    }
};

export {createEvent, read1Event, readAllEvent, updateEvent, deleteEvent};