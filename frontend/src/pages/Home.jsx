import {Link} from "react-router-dom";
import {motion, useTransform, useScroll} from "framer-motion";
import {useRef} from "react";


const Home = () => {
    return (
        <>
            {/* Hospital Hero section */}
            <div className="w-full md:h-[856px] relative">
                {/* hospital image */}
                <img
                    src="/images/hospital-final.jpg"
                    alt="Hospital"
                    className="block max-h-100% object-cover"
                />

                {/* hospital image text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white md:px-[151px] w-1/2">

                    {/* Deecare */}
                    <div className="md:font-bold md:text-[64px]">
                        DeeCare
                    </div>

                    {/* hospital motto */}
                    <p className="md:w-1/2 font-medium text-center break-words">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur fugit consequatur veritatis
                        sapiente laborum quidem, assumenda libero consequuntur! Vel blanditiis dolore laboriosam itaque
                        ipsam necessitatibus?
                    </p>

                    {/* Appointment button */}
                    <Link       
                        to="FindDoctor"    
                        className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600">
                            Appointment
                    </Link>
            {/*        <button className='md:block bg-yellow text-white*/}
            {/*px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-all*/}
            {/*hover:shadow-lg hover:shadow-blue-100'>*/}
            {/*            <Link to="/FindDoctor">Appointment</Link>*/}
            {/*        </button>*/}
                </div>
            </div>


            {/* Explore Events */}
            <section className="px-[114px] md:px-20 bg-amber-200">
                <h2 className="text-2xl font-bold mb-3">
                    Explore Events 🩺
                </h2>
                <HorizontalScrollCarousel />
            </section>
        </>
    );
}; 

// Explore event data
const eventData = [
    {
        id: 1,
        image: "/images/event.jpg",
        day: "31",
        month: "Aug",
        title: "Medical Fair Asia 2022",
        date: "31 August - 2 September 2022 (Physical), 3 - 9 September (Digital, Online)",
        description: "Join us for a health talk on the latest medical advancements.",
        place: "Marina Bay Sands, Singapore",
        website: "https://www.hhmglobal.com/events/medical-fair-asia-2022",
    },
    {
        id: 2,
        image: "/images/event1.jpg",
        day: "7",
        month: "May",
        title: "Mars Impact Health",
        date: "",
        place: "",
        description: "Learn about mental health and stress management techniques.",
        website: "https://impacthealth.marsdd.com/",
    },
    {
        id: 3,
        image: "/images/event3.jpg",
        day: "",
        month: "",
        title: "Yoga Session",
        date: "",
        place: "",
        description: "Relax your mind and body with our expert-guided yoga sessions.",
        website: "",
    },
    {
        id: 4,
        image: "/images/event4.jpg",
        day: "",
        month: "",
        title: "Community Health Check",
        date: "",
        place: "",
        description: "Get free health check-ups from our medical professionals.",
        website: "",
    },
];

const HorizontalScrollCarousel = () => {
    const targetRef = useRef(null);
    const {scrollXProgress} = useScroll({
        container: targetRef,
        axis: "x",
    });

    const x = useTransform(scrollXProgress, [0, 1], ["0%", "-70%"]);

    return (
        <div
            ref={targetRef}
            className="relative w-full overflow-x-auto whitespace-nowrap scrollbar-hide flex py-3">
            <motion.div style={{x}} className="flex sm:gap-[58px]">
                {eventData.map((event) => (
                    <div 
                        // event box
                        key={event.id}
                        className=" bg-white rounded-3xl shadow-md sm:w-[366px] sm:h-[355px]">

                        {/* inside box */}
                        {/* image */}
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full rounded-3xl h-[223px] p-[12px] object-cover "
                        />

                        {/* event detail */}
                        <div className="flex justify-start items-center px-[12px]">

                            {/* event start date */}
                            <div 
                                className="sm:w-[86px] sm:h-[86px] sm:mr-[14px] flex justify-center items-center bg-light-blue rounded-2xl  font-medium flex-col">
                                    <p>{event.day}</p>
                                    <p>{event.month}</p>
                            </div>


                            {/* event detail */}
                            <div>
                                {/* event topic */}
                                <h1 className="sm:font-medium ">
                                    {event.title}
                                </h1>

                                {/* Event date */}
                                <div className="flex">
                                    <img 
                                        src="/icons/calendar-event.svg" 
                                        alt="icons calendar-event" 
                                    />
                                    <p className="ml-2  truncate">
                                        {event.date}
                                    </p>
                                </div>

                                {/* place */}
                                <div className="flex">
                                    <img 
                                        src="/icons/map-pin.svg" 
                                        alt="icon map-pin"
                                    />
                                    <p className="ml-2 break-words">
                                        {event.place}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Home;
// sm:max-w-[366px]  sm:max-h-[355px] min-h-[183px]
// min-w-[172px] min-h-[183px]
// sm:max-w-[366px] sm:min-h-[355px]
