// https://schedule-x.dev/docs/frameworks/react
// import { Link } from "react-router-dom";

import {useState} from "react"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import {useCalendarApp, ScheduleXCalendar} from '@schedule-x/react'
import {
    createViewWeek,
    createViewMonthGrid,
    createViewMonthAgenda,
} from '@schedule-x/calendar'
import {createEventsServicePlugin} from '@schedule-x/events-service'
import {createEventModalPlugin} from '@schedule-x/event-modal'
import '@schedule-x/theme-default/dist/index.css'
import {createCurrentTimePlugin} from "@schedule-x/current-time";
import {createCalendarControlsPlugin} from "@schedule-x/calendar-controls";
import {format} from 'date-fns'

function Timeslot() {
    const eventsService = useState(() => createEventsServicePlugin())[0];
    const calendarControls = useState(() => createCalendarControlsPlugin())[0]

    const calendar = useCalendarApp({
        views: [
            createViewWeek(),
            createViewMonthGrid(),
            createViewMonthAgenda(),
        ],
        events: [
            {
                id: '1',
                title: 'Event 1',
                start: '2025-04-21 10:12',
                end: '2025-04-21 11:15',
                people: ["Somsak", "SomSri", "SomSome"],
                location: "CB2308",
                description: "Sleep Sleep Sleep all day"
            },
        ],
        plugins: [
            calendarControls,
            eventsService,
            createEventModalPlugin(),
            createCurrentTimePlugin()
        ],
        dayBoundaries: {
            start: '06:00',
            end: '18:00',
        },
        isResponsive: true,
    })

    const [selectedDate, setSelectedDate] = useState(new Date())
    const handleMiniCalendarChange = (date) => {
        setSelectedDate(date)
        calendarControls.setDate(format(date, 'yyyy-MM-dd'));
    }

    return (
        <>
            {/* Whole page */}
            <div className="m-[64px]">

                {/* block doctor detail */}
                <div className="bg-light-blue rounded-2xl ">
                    {/* inside */}
                    <div className="flex justify-start items-center ">
                        {/* doctor image */}
                        <img src="/images/Dr_Apple.jpg"
                             alt="doctor Apple"
                             className="rounded-full w-[150px] mr-[64px]"
                        />
                        {/* doctor detail */}
                        <div className="flex flex-col justify-center">
                            <p>Name:</p>
                            <p>Department:</p>
                            <p>Work hour:</p>
                        </div>
                    </div>
                </div>
                {/* both calendars */}
                <div className='flex flex-col lg:flex-row justify-between'>
                    {/* Left part */}
                    <div className="flex sm:flex-col">
                      {/* small Calendar */}
                      <div>
                        <Calendar
                          onChange = {handleMiniCalendarChange}
                          value = {selectedDate}
                        />
                      </div>
                      <button className="bg-yellow w-full rounded text-white">
                        Confirm
                      </button>
                    </div>

                    {/* Full Calendar */}
                    <div>
                        <ScheduleXCalendar calendarApp={calendar}/>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Timeslot;

{/* <div>
      <div className="text-4xl">time slot page</div>
      <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>   
       <button>
        <Link to="/Confirm">Confirm doctor and date</Link>
      </button>
      </div>
      <div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/FindDoctor"> back </Link>
      </button>
      </div>
    </div> */
}
