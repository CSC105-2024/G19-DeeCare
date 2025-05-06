import { db } from "../index.ts";

const readAllEvent = async () => {
    const event = await db.event.findMany();
    return event;
}
const read1Event = async (id: number) => {
    const event = await db.event.findUnique({
        where: {
            id: id,
        },
    });
    return event;
}
export { readAllEvent, read1Event };