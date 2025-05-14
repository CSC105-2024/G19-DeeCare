import { db } from "../index.ts";

export const readAllEvent = async () => {
    const event = await db.event.findMany();
    return event;
}
export const read1Event = async (id: number) => {
    const event = await db.event.findUnique({
        where: {
            id: id,
        },
    });
    return event;
}

type CreateEventData = {
  name: string;
  eventDates: string;
  image?: string;
  place: string;
  website?: string;
  organizer: string;
  phone: string;
  email: string;
  linkedin?: string;
  description: string;
};

// eventData is just a name for the input object createEvent({ name: "KMUTT Day", ... })

export const createEvent = async (eventData: CreateEventData) => {
    const newEvent = await db.event.create({
        data: eventData,
    });
    return newEvent;
};

type UpdateEventData = Partial<{
  name: string;
  eventDates: string;
  image?: string;
  place: string;
  website?: string;
  organizer: string;
  phone: string;
  email: string;
  linkedin?: string;
  description: string;
}>;
 
export const UpdatedEventDetails = async (eventId: number, eventData: UpdateEventData) => {
    const editEvent = await db.event.update({
        where: {
            id: eventId,
        },
        data: eventData,
    })
    return editEvent;
}

export const deletedEvent = async (eventId: number) => {
    const delEvent = await db.event.delete({
        where: {
            id: eventId,
        }
    })
    return delEvent;
}

