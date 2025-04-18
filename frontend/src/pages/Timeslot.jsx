// https://schedule-x.dev/docs/frameworks/react
// import { Link } from "react-router-dom";

import { useState, useEffect } from "react"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewWeek,
  // createViewMonthGrid,
  // createViewMonthAgenda,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'

function Timeslot() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
 
  const calendar = useCalendarApp({
    views: [
      createViewDay(), 
      createViewWeek(), 
      // createViewMonthGrid(), 
      // createViewMonthAgenda()
    ],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2025-04-15',
        end: '2025-04-16',
      },
    ],
    plugins: [eventsService]
  })
 
  useEffect(() => {
    // get all events
    eventsService.getAll()
  }, [])

  const [selectedDate, setSelectedDate] = useState(new Date())
  const handleMiniCalendarChange = (date) => {
    setSelectedDate(date)
    calendar.calendarApi.setCurrentDate(date) // เปลี่ยนวันใน ScheduleXCalendar
  }

  // return (
  //   <div>
  //     <ScheduleXCalendar calendarApp={calendar} />
  //   </div>
  // )

// const Timeslot = () => {
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
        <div className='flex justify-between'>
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
    </div> */}
