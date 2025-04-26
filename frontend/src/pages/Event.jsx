import React from "react";
import { useParams, Link } from "react-router-dom";
import {eventData} from "../Data/EventData.jsx";

const Event = () => {
  const { id } = useParams();
  const event = eventData.find((event) => event.id === parseInt(id));

  if (!event) {
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
          <h1 className="font-semibold text-xl block sm:hidden">
            {event.title}
          </h1>

          {/* event date */}
          <div className="sm:w-[128px] w-full max-w-[200px] sm:h-[128px] h-[100px] sm:mr-[42px] flex flex-none justify-center items-center bg-light-blue rounded-2xl flex-col font-medium py-3">
            <p className="text-2xl sm:text-3xl">{event.day}</p>
            <p className="text-lg sm:text-xl">{event.month}</p>
          </div>

          {/* detail */}
          <div>
            {/* event desktop topic */}
            <h1 className="font-semibold text-2xl hidden sm:block mb-3">
              {event.title}
            </h1>

            {/* Event date */}
            <div className="flex items-center mb-2">
              <img 
                src="/icons/calendar-event.svg" 
                alt="icons calendar-event"
                className="w-5 h-5" />
              <p className="ml-2 break-words">
                {event.date}
              </p>
            </div>

            {/* place */}
            <div className="flex items-center">
              <img 
                src="/icons/map-pin.svg" 
                alt="icon map-pin"
                className="w-5 h-5" />
              <p className="ml-2 break-words">
                {event.place}
              </p>
            </div>
          </div>
        </div>

        {/* event image */}
        <div className="bg-light-blue flex justify-center items-center my-[32px] rounded-lg overflow-hidden">
          <img 
            src={event.image} 
            alt={`Event ${event.title}`} 
            className="h-[300px] sm:h-[400px] py-1 object-cover" />
        </div>
        
        {/* Contact Info */}
        <div className="space-y-3">
          <h2 className="font-medium text-xl mb-3">Contact Information</h2>
          {/* event organizer */}
          <div className="flex items-center">
            <img 
              src="/icons/map-pin.svg" 
              alt="icon map-pin"
              className="w-5 h-5" />
            <p className="ml-2 break-words text-gray-700 ">  
              {event.organizer}
            </p>
          </div>
          
          {/* event website */}
          <div className="flex items-center">
            <img 
              src="/icons/link.svg" 
              alt="website-link"
              className="w-5 h-5" />
            <a href={event.website} target="_blank"  className="ml-2 break-words text-blue-600 hover:underline">
              {event.website}
            </a>
          </div>

          {/* event contact*/}
          <div className="flex items-center">
            <img 
              src="/icons/phone.svg" 
              alt="icon-phone"
              className="w-5 h-5" />
            <p className="ml-2 text-gray-700 "> 
              {event.phone}
            </p>
          </div>
          
          {/* event mail */}
          <div className="flex items-center">
            <img 
              src="/icons/mail.svg" 
              alt="icon-mail"
              className="w-5 h-5" />
            <a href={`mailto:${event.email}`} className="ml-2 break-words text-blue-600 hover:underline">  
              {event.email}
            </a>
          </div>
          
          {/* event linkedin */}
          <div className="flex items-center">
            <img 
              src="/icons/at.svg" 
              alt="icon-at"
              className="w-5 h-5" />
            <a href={`https://${event.linkedin}`} target="_blank" rel="" className="ml-2 break-words text-blue-600 hover:underline"> 
              {event.linkedin}
            </a>
          </div>
        </div>

        {/* event description - more details */}
        <div className="mt-[32px]">
          <h2 className="font-medium text-xl mb-3 ">Event Description</h2>
          <p className="break-words text-gray-700 leading-relaxed">
            {event.description}
          </p>
        </div>

        
      </div>
    </>
  );
};

export default Event;