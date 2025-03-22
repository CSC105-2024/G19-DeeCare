import { Link } from "react-router-dom";
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import Hospital1 from "../images/Hospital1.jpg";

const Home = () => {
  return (
    <>
      {/* Hospital Image */}
      <div className="w-full md:h-[856px] relative">
        <img
          src={Hospital1}
          alt="Hospital"
          className="w-full h-full object-cover"
        />
        {/* Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white md:px-[151px] w-1/2">
          <div className="md:font-bold md:text-[96px]">DeeCare</div>
          <p className="md:w-1/2 font-medium text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi architecto porro est asperiores vel, rerum voluptate ipsum repellat sapiente mollitia dolor nihil perferendis dolorem accusantium omnis quisquam eveniet similique eius aperiam dicta excepturi consequatur dolore.
          </p>
        </div>
      </div>

      {/* Event with Horizontal Scroll */}
      <HorizontalScrollCarousel />

      {/* Contact */}
      <div className="bg-blue-100 py-6 px-4">
        <div className="flex flex-col gap-2">
          <p>📞 +XX XXX XXXX</p>
          <p>📍 Siam Bangkok 10200</p>
          <p>📧 Deecare@gmail.com</p>
          <p>💬 @Deecare</p>
        </div>
      </div>
    </>
  );
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollXProgress } = useScroll({
    container: targetRef, // ใช้ scroll ใน container นี้
    axis: "x",
  });

  const x = useTransform(scrollXProgress, [0, 1], ["0%", "-70%"]);

  return (
    <div
      ref={targetRef}
      className="relative w-full overflow-x-auto whitespace-nowrap scrollbar-hide"
    >
      <motion.div style={{ x }} className="flex gap-4 py-10">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="min-w-[250px] bg-gray-100 p-4 rounded-lg"
          >
            <img
              src="/path-to-image"
              alt={`event ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
            <p className="mt-2 text-sm">Put like information</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
