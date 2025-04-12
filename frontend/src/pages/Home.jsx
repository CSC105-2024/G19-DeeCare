import { Link, NavLink } from "react-router-dom";
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";


const Home = () => {
  return (
    <>
      <div className="bg-page">
          {/* Hospital Image */}
        <div className="w-full md:h-[856px] relative">
          <img
            src="/images/Hospital1.jpg"
            alt="Hospital"
            className="block max-width-100% object-cover" 
            // w-full h-full
          />
          {/* Hospital describe */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white md:px-[151px] w-1/2">
            {/* ชื่อ Website */}
            <div className="md:font-bold md:text-[64px]">DeeCare</div>
            {/* blue box */}
            <div className="bg-p1 bg-opacity-20">
              {/* motto */}
              <p className="md:w-1/2 font-medium text-center ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur fugit consequatur veritatis sapiente laborum quidem, assumenda libero consequuntur! Vel blanditiis dolore laboriosam itaque ipsam necessitatibus?
              </p>
            </div>
          </div>
          {/* Appointment botton */}
          <button className='md:block bg-amber-200 text-white 
              px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-all 
              hover:shadow-lg hover:shadow-blue-100'>
                  <Link to="/FindDoctor">Appointment</Link>
          </button>  
        </div>
      </div>

      {/* Event with Horizontal Scroll */}
      <HorizontalScrollCarousel />
    </>
  );
};

const eventData = [
  {
    id: 1,
    image: "../images/Dr_Mango.jpg",
    title: "Health Talk with dr.Tany",
    description: "Join us for a health talk on the latest medical advancements.",
  },
  {
    id: 2,
    image: "src/images/event2.jpg",
    title: "Wellness Workshop",
    description: "Learn about mental health and stress management techniques.",
  },
  {
    id: 3,
    image: "../images/event3.jpg",
    title: "Yoga Session",
    description: "Relax your mind and body with our expert-guided yoga sessions.",
  },
  {
    id: 4,
    image: "../images/event4.jpg",
    title: "Community Health Check",
    description: "Get free health check-ups from our medical professionals.",
  },
];

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollXProgress } = useScroll({
    container: targetRef,
    axis: "x",
  });

  const x = useTransform(scrollXProgress, [0, 1], ["0%", "-70%"]);

  return (
    <div
      ref={targetRef}
      className="relative w-full overflow-x-auto whitespace-nowrap scrollbar-hide flex"
    >
      <motion.div style={{ x }} className="flex gap-4 py-10">
        {eventData.map((event) => (
          <div
            key={event.id}
            className="min-w-[250px] bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-32 object-cover rounded-md"
            />
            <h3 className="mt-2 font-bold">{event.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{event.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
