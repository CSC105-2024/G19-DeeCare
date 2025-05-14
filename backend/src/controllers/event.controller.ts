import type { Context } from 'hono'
import * as eventModel from '../models/event.model.ts'

const createEvent = async (c: Context) => {
	try {
		const body = await c.req.json();
		if (!body) {
			return c.json({
				success: false,
				data: null,
				msg: 'Missing Required Field',
			});
		}
		const newEvent = await eventModel.createEvent(body);
		return c.json({
			success: true,
			data: newEvent,
			msg: 'Successfully created new event',
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
        if(!event) {
            return c.json({
                success: false,
                data: null,
                msg: "Event not found"
            });
        }else {
            return c.json({
                success: true,
                data: event,
                msg: "Found Event data"
            })
        }
    }
    catch(e) {
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
        if(!event || event.length === 0) {
            return c.json({
                success: false,
                data: null,
                msg: "Event not found"
            });
        }else {
            return c.json({
                success: true,
                data: event,
                msg: "Found Event data"
            });
        }
    }
    catch(e) {
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

export { createEvent, read1Event, readAllEvent, updateEvent, deleteEvent };