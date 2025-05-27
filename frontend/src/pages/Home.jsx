import {Link} from "react-router-dom";
import {motion, useTransform, useScroll} from "framer-motion";
import {useEffect, useRef, useState} from "react";
// import {eventData} from "../Data/EventData.jsx";
// import { Axios } from "../utils/axiosInstance.js";
import { getEventAPI } from "../api/getEvents.js";

const Home = () => {
    const [ Events, setEvents] = useState([]);

    const fetchEventData = async () => {
        try{
          const response = await getEventAPI();
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
        fetchEventData();
      }, []);
    return (
        <>
            {/* Hospital Hero section */}
            <div className="relative z-10 w-full">
                {/* hospital image */}
                <img
                    src="/images/hospital-final.jpg"
                    alt="Hospital"
                    className="block object-cover z-20 object-bottom
                    h-[236px] w-full 
                    sm:h-[700px]"
                />

                {/* text-block */}
                <div className="absolute flex flex-col items-start justify-center text-white bg-pri/80 z-30 rounded-2xl 
                left-[22px] top-[22px] 
                sm:left-20  sm:top-[168px] 
                h-[78%] w-[80%] 
                sm:max-w-[508px] sm:max-h-[363px]
                px-[16px]  sm:px-[51px]">

                    {/* Deecare */}
                    <div className="z-50 font-semibold sm:text-[64px] text-[24px]">
                        DeeCare
                    </div>

                    {/* hospital motto */}
                    <p className="break-words z-40 text-xs sm:text-[20px]">
                        No more long waits. Book your appointment now and stay informed.
                        {/* A smarter way to book your doctor — quick, safe, and designed with care. */}
                    </p>

                    {/* Appointment button */}
                    <Link       
                        to="FilterBar"    
                        className="bg-yellow-500 text-white sm:px-6 sm:py-2  px-3 py-1 rounded-md font-medium hover:bg-yellow-600 z-50 sm:mt-[20px] mt-[16px] text-xs sm:text-[20px]">
                            Appointment
                    </Link>
                </div>
            </div>

            {/* Explore Events */}
            <section className="h-[289px] sm:min-h-[600px] w-full py-[30px] sm:py-[100px]"
            id="eventCard">
                <div>
                    <h2 className="sm:text-2xl text-base font-medium sm:mb-3 px-[28px] sm:px-[125px] ">
                        Explore Events 🩺
                    </h2>
                    <div className="px-[16px] sm:px-[112px]">
                        <HorizontalScrollCarousel Events={Events}/>
                    </div>
                </div>
            </section>
        </>
    );
}; 

const HorizontalScrollCarousel = ({ Events }) => {
    const targetRef = useRef(null);
    const {scrollXProgress} = useScroll({
        container: targetRef,
        axis: "x",
    });

    const x = useTransform(scrollXProgress, [0, 1], ["0%", "-70%"]);
    return (
        <div
            ref={targetRef}
            className="relative w-full overflow-x-auto whitespace-nowrap scrollbar-hide flex py-3 bg-background">
            <motion.div 
                style={{x}} 
                className="flex w-full sm:gap-[58px] gap-[16px] ">   
                {Events.map((event) => (
                    <Link to = {`/Event/${event.id}`} 
                        // event box
                        key={event.id}
                        className="flex-none bg- cursor-pointer rounded-2xl shadow-md sm:min-w-[366px] w-[172px]"
                        >

                        {/* inside box */}
                        {/* image */}
                        <img
                            src={event.image}
                            alt={event.name}
                            className="w-full rounded-3xl sm:h-[223px] sm:p-[12px] p-[10px] h-[110px] object-cover "
                        />

                        {/* event detail */}
                        <div className="flex justify-center items-center sm:pb-[15px] sm:px-[12px] pb-[14px] px-[10px]">

                            {/* event start date */}
                            <div 
                                className="sm:w-[86px] sm:h-[86px] w-[45px] h-[45px] sm:mr-[14px] mr-[4px] flex flex-col flex-none justify-center items-center bg-light-blue rounded-xl font-medium text-[10px] sm:text-[18px]">
                                    <p>{event.day}</p>
                                    <p>{event.month}</p>
                            </div>


                            {/* event detail */}
                            <div className="flex-1 min-w-0">
                                {/* event topic */}
                                <h1 className="sm:font-medium truncate w-full sm:text-base text-[10px]">
                                    {event.name}
                                </h1>

                                {/* Event date */}
                                <div className="flex">
                                    <img 
                                        src="/icons/calendar-event.svg" 
                                        alt="icons calendar-event" 
                                        className="sm:w-[20px] sm:h-[20px] w-[8px] h-[8px]"
                                    />
                                    <p className="ml-2 text-ellipsis overflow-hidden whitespace-nowrap w-full text-[8px] font-normal sm:text-base">
                                        {event.eventDates}
                                    </p>
                                </div>

                                {/* place */}
                                <div className="flex">
                                    <img 
                                        src="/icons/map-pin.svg" 
                                        alt="icon map-pin"
                                        className="sm:w-[20px] sm:h-[20px] w-[8px] h-[8px]"
                                    />
                                    <p className="ml-2 truncate w-full text-[8px] font-normal sm:text-base">
                                        {event.place}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
};

export default Home;