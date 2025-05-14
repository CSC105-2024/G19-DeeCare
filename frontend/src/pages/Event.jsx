import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// import {eventData} from "../Data/EventData.jsx";
import { Axios } from "../utils/axiosInstance.js";
import { getEventAPIbyID } from "../api/getEvents.js";
import axios from "axios";
// import { getEventAPI } from "../api/getEvents.js";

const  Event = () => {
  const [ Events, setEvents] = useState([]); 
const {id} = useParams();
 

  const fetchEventData = async (id) => {
    try{
     
      console.log(id);
      const response = await getEventAPIbyID(id);
      if (response.data.success) {
        setEvents(response.data.data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (e) {
      console.error("Error fetching events:", e);
    } finally {
      // setLoading(false);
    }
	};

  useEffect(() => {
    fetchEventData(id);
  }, [id]);

  
//   console.log("param id", id);
// console.log("event ids:", events.map(e => e.id));

// const event = Events.find((event) => event.id === Number(id));  

  if (!Events) {
    return (
      <div className="sm:m-[64px] m-[32px] text-center bg-[#FAF9F6]">
        <div className="text-2xl font-semibold mb-4">Event not found</div>
        <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
        
        <Link to="/" className="bg-pri text-white px-4 py-2 rounded-md font-medium hover:bg-pri/80">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* page content */}
      <div className="sm:m-[64px] m-[32px]">
        {/* event brief */}
        <div className="flex sm:justify-start items-center sm:h-[128px] h-auto sm:flex-row flex-col gap-4 sm:gap-0">
          {/* event mobile topic */}
          <h1 className="font-semibold text-xl block sm:hidden pt-8 ">
            {Events.name}
          </h1>

          {/* event date */}
          <div className="sm:w-[128px] w-full max-w-[200px] sm:h-[128px] h-[100px] sm:mr-[42px] flex flex-none justify-center items-center bg-light-blue rounded-2xl flex-col font-medium py-3">
            <p className="text-2xl sm:text-3xl">{Events.day}</p>
            <p className="text-lg sm:text-xl">{Events.month}</p>
          </div>

          {/* detail */}
          <div>
            {/* event desktop topic */}
            <h1 className="font-semibold text-2xl hidden sm:block mb-3">
              {Events.name}
            </h1>

            {/* Event date */}
            <div className="flex items-start mb-2">
              <img 
                src="/icons/calendar-event.svg" 
                alt="icons calendar-event"
                className="w-5 h-5" />
              <p className="ml-2 break-words">
                {Events.eventDates}
              </p>
            </div>

            {/* place */}
            <div className="flex items-start">
              <img 
                src="/icons/map-pin.svg" 
                alt="icon map-pin"
                className="w-5 h-5" />
              <p className="ml-2 break-words">
                {Events.place}
              </p>
            </div>
          </div>
        </div>

        {/* event image */}
        <div className="bg-light-blue flex justify-center items-center my-[32px] rounded-lg overflow-hidden">
          <img 
            src={Events.image} 
            alt={`Events ${Events.title}`} 
            className="h-[300px] sm:h-[400px] py-1 object-cover" />
        </div>
        
        {/* Contact Info */}
        <div className="space-y-3">
          <h2 className="font-medium text-xl mb-3">Contact Information</h2>
          {/* Events organizer */}
          <div className="flex items-center">
            <img 
              src="/icons/map-pin.svg" 
              alt="icon map-pin"
              className="w-5 h-5" />
            <p className="ml-2 break-words text-gray-700 ">  
              {Events.organizer}
            </p>
          </div>
          
          {/* Events website */}
          <div className="flex items-center">
            <img 
              src="/icons/link.svg" 
              alt="website-link"
              className="w-5 h-5" />
            <a href={Events.website} target="_blank"  className="ml-2 break-words truncate text-blue-600 hover:underline">
              {Events.website}
            </a>
          </div>

          {/* Events contact*/}
          <div className="flex items-center">
            <img 
              src="/icons/phone.svg" 
              alt="icon-phone"
              className="w-5 h-5" />
            <p className="ml-2 text-gray-700 "> 
              {Events.phone}
            </p>
          </div>
          
          {/* Events mail */}
          <div className="flex items-center">
            <img 
              src="/icons/mail.svg" 
              alt="icon-mail"
              className="w-5 h-5" />
            <a href={`mailto:${Events.email}`} className="ml-2 break-words truncate text-blue-600 hover:underline">  
              {Events.email}
            </a>
          </div>
          
          {/* Events linkedin */}
          <div className="flex items-center">
            <img 
              src="/icons/at.svg" 
              alt="icon-at"
              className="w-5 h-5" />
            <a href={`https://${Events.linkedin}`} target="_blank" rel="" className="ml-2 break-words truncate text-blue-600 hover:underline"> 
              {Events.linkedin}
            </a>
          </div>
        </div>

        {/* Events description - more details */}
        <div className="mt-[32px]">
          <h2 className="font-medium text-xl mb-3 ">Events Description</h2>
          <p className="break-words text-gray-700 leading-relaxed">
            {Events.description}
          </p>
        </div>

        
      </div>
    </>
  );
};

export default Event;