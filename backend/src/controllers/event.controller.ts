import type { Context } from 'hono'
import * as eventModel from '../models/event.model.ts'

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

export { read1Event, readAllEvent };