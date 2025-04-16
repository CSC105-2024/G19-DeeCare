import {Link} from "react-router-dom";
import {motion, useTransform, useScroll} from "framer-motion";
import {useRef} from "react";


const Home = () => {
    return (
        <>
            {/* Hospital Hero section */}
            <div className=" relative z-10">
                {/* hospital image */}
                <img
                    src="/images/hospital-final.jpg"
                    alt="Hospital"
                    className="block h-[236px] sm:min-h-[700px] object-cover z-20"
                />

                {/* text-block */}
                <div className="absolute flex flex-col items-start justify-center text-white bg-pri/80 z-30 rounded-2xl
                left-[22px] top-[22px] w-[272px] h-[190px] px-[16px]
                sm:left-20  sm:top-[168px] sm:w-[508px] sm:h-[363px]    sm:px-[51px] px-">

                    {/* Deecare */}
                    <div className="z-50 font-semibold sm:text-[64px] text-[24px]">
                        DeeCare
                    </div>


                    {/* hospital motto */}
                    <p className="break-words z-40 text-xs sm:text-[20px]">
                        No more long waits. Book your appointment in seconds and stay informed.
                        {/* A smarter way to book your doctor — quick, safe, and designed with care. */}
                    </p>

                    {/* Appointment button */}
                    <Link       
                        to="FindDoctor"    
                        className="bg-yellow-500 text-white sm:px-6 sm:py-2  px-3 py-1 rounded-md font-medium hover:bg-yellow-600 z-50 sm:mt-[20px] mt-[16px] text-xs sm:text-[20px]">
                            Appointment
                    </Link>
                </div>
            </div>

            {/* Explore Events */}
            <section className="sm:h-[659px] h-[289px] w-full sm:py-[108px] py-[30px]">
                <div>
                    <h2 className="sm:text-2xl text-base font-medium sm:mb-3 px-[28px] sm:px-[125px] ">
                        Explore Events 🩺
                    </h2>
                    <div className=" px-[16px] sm:px-[113px]">
                        <HorizontalScrollCarousel/>
                    </div>
                </div>
            </section>
        </>
    );
}; 

// Explore event data
const eventData = [
    {
        id: 1,
        image: "/images/event1.jpg",
        day: "31",
        month: "Aug",
        title: "Medical Fair Asia 2022",
        date: "31 Aug - 2 Sep 2022 (Physical), 3 Sep - 9 Sep (Digital, Online)",
        // description: "Join us for a health talk on the latest medical advancements.",
        place: "Marina Bay Sands, Singapore",
        website: "https://www.hhmglobal.com/events/medical-fair-asia-2022",
    },
    {
        id: 2,
        image: "/images/event2.jpg",
        day: "7",
        month: "May",
        title: "MaRS Impact Health",
        date: "7 - 8 May 2025",
        place: "MaRS Centre, 101 College St., Toronto, ON",
        // description: "Learn about mental health and stress management techniques.",
        website: "https://impacthealth.marsdd.com/",
    },
    {
        id: 3,
        image: "/images/event3.jpg",
        day: "16",
        month: "Feb",
        title: "Healthcare Scholarships & Careers Fair 2025",
        date: "16 Feb 2025 from 10am to 5pm.",
        place: "Suntec Singapore Convention & Exhibition Centre Halls 401-403",
        // description: "Relax your mind and body with our expert-guided yoga sessions.",
        website: "https://www.facebook.com/photo.php?fbid=1030729712422353&id=100064560017254&set=a.204499941712005",
    },
    {
        id: 4,
        image: "/images/event4.jpg",
        day: "26",
        month: "June",
        title: "THAILAND WELLNESS & HEALTHCARE EXPO 2025",
        date: "26 - 29 June 2025 from 10am to 7pm.",
        place: "EH 101",
        // description: "Get free health check-ups from our medical professionals.",
        website: "https://www.bitec.co.th/event/thailand-wellness-healthcare-expo-2025",
    },
    {
        id: 5,
        image: "/images/event5.jpg",
        day: "24",
        month: "Feb",
        title: "Saudi Hospital design & build expo",
        date: "24 - 27 Feb from 2pm to 10 pm",
        place: "Riyadh International Convention & Exhibition Centre (RICEC) King Abdullah Rd, King Abdullah Dt., Riyadh 11564, Saudi Arabia",
        // description: "Get free health check-ups from our medical professionals.",
        website: "https://www.arabisklondon.com/events/Saudi-Hospital-Design-and-Build-Expo-2025",
    },
    {
        id: 6,
        image: "/images/event6.jpg",
        day: "1",
        month: "Jan",
        title: "International Immunity Boost",
        date: "1 Jan - 31 Dec 2025",
        place: "International Medical Services - 4th Floor, R Building",
        description: "Get free health check-ups from our medical professionals.",
        website: "https://www.bangkokhospital.com/en/package/international-immunity-boost",
    },
    {
        id: 7,
        image: "/images/event7.jpg",
        day: "19",
        month: "Feb",
        title: "MH Expo Jakarta 2025",
        date: "19 - 24 Feb 2025",
        place: "Central Park Mall",
        description: "Get free health check-ups from our medical professionals.",
        website: "https://www.instagram.com/umspecialistcentre/p/DGR5iLCzB39/?img_index=1",
    },
    {
        id: 8,
        image: "/images/event8.jpg",
        day: "4",
        month: "Mar",
        title: "Beginning of Hope",
        date: "4 Mar - 30 June 2025",
        place: "Nakornthon Hospital, 1 Rama II Road Soi 56, Samaedam, Bangkhuntien, Bangkok 10150",
        description: "Get free health check-ups from our medical professionals.",
        website: "https://www.nakornthon.com/page/info/beginning-of-hope-nakornthon-gift-fertility",
    },
    {
        id: 9,
        image: "/images/event9.jpg",
        day: "9",
        month: "Jan",
        title: "2024 CAMPUS Asia International Symposium & Faculty Meeting",
        date: "9 - 10 Jan 2024",
        place: "Sirindhorn Conference Room, 1st Floor, Chalermprakiat Building.",
        // description: "Get free health check-ups from our medical professionals.",
        website: "https://www2.si.mahidol.ac.th/en/news-events/siriraj-hosts-2024-campus-asia-international-symposium-faculty-meeting-to-enhance-medical-cooperation-in-asia/",
    },
];

const HorizontalScrollCarousel = () => {
    // const navigate = useNavigate();
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
                {eventData.map((event) => (
                    <Link to = {`/Event/${event.id}`} 
                        // event box
                        key={event.id}
                        className="bg- cursor-pointer rounded-2xl shadow-md sm:min-w-[366px]   w-[172px] sm:min-h-full h-full"
                        // h-[182px] sm:h-[355px]
                        >

                        {/* inside box */}
                        {/* image */}
                        <img
                            src={event.image}
                            alt={event.title}
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
                                    {event.title}
                                </h1>

                                {/* Event date */}
                                <div className="flex">
                                    <img 
                                        src="/icons/calendar-event.svg" 
                                        alt="icons calendar-event" 
                                        className="sm:w-[20px] sm:h-[20px] w-[8px] h-[8px]"
                                    />
                                    <p className="ml-2 text-ellipsis overflow-hidden whitespace-nowrap w-full text-[8px] font-normal sm:text-base">
                                        {event.date}
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
// sm:max-w-[366px]  sm:max-h-[355px] min-h-[183px]
// min-w-[172px] min-h-[183px]
// sm:max-w-[366px] sm:min-h-[355px]
