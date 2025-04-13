import {Link} from "react-router-dom";
import {motion, useTransform, useScroll} from "framer-motion";
import {useRef} from "react";


const Home = () => {
    return (
        <>
            {/* Hospital Image */}
            <div className="w-full md:h-[856px] relative">
                <img
                    src="/images/Hospital1.jpg"
                    alt="Hospital"
                    className="block max-width-100% object-cover"
                    // w-full h-full
                />
                {/* Text */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-white md:px-[151px] w-1/2">
                    <div className="md:font-bold md:text-[64px]">DeeCare</div>
                    <p className="md:w-1/2 font-medium text-center">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur fugit consequatur veritatis
                        sapiente laborum quidem, assumenda libero consequuntur! Vel blanditiis dolore laboriosam itaque
                        ipsam necessitatibus?
                    </p>
                    <Link to="/FindDoctor" className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600">
                        Appointment
                    </Link>
            {/*        <button className='md:block bg-yellow text-white*/}
            {/*px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-all*/}
            {/*hover:shadow-lg hover:shadow-blue-100'>*/}
            {/*            <Link to="/FindDoctor">Appointment</Link>*/}
            {/*        </button>*/}
                </div>
            </div>

            {/* Events */}
            <section className="py-12 px-6 md:px-20">
                <h2 className="text-2xl font-bold mb-6">Explore Event 🩺</h2>
                <HorizontalScrollCarousel />
            </section>

{/*            /!* Footer *!/*/}
{/*            <div className="bg-blue-100 py-6 px-4 ">*/}
{/*                <div className="container mx-20">*/}
{/*                    <h2>Contact</h2>*/}
{/*                    <div className="flex flex-col gap-2">*/}
{/*                        <p className="inline-flex items-center gap-2">*/}
{/*                            <img src="/icons/call.png" alt="" className="h-4"/>*/}
{/*                            +XX XXX XXXX*/}
{/*                        </p>*/}
{/*                        <p className="inline-flex items-center gap-2">*/}
{/*                            <img src="/icons/map.png" alt="" className="h-5"/>*/}
{/*                            Siam Bangkok 10200*/}
{/*                        </p>*/}
{/*                        <p className="inline-flex items-center gap-2">*/}
{/*                            <img src="/icons/email.png" alt="" className="h-5"/>*/}
{/*                            Deecare@gmail.com*/}
{/*                        </p>*/}
{/*                        <p className="inline-flex items-center gap-2">*/}
{/*                            <img src="/icons/line.png" alt="" className="h-5"/>*/}
{/*                            @Deecare*/}
{/*                        </p>*/}
{/*                    </div>*/}
{/*                </div>*/}
{/*            </div>*/}
{/*        </>*/}
{/*    );*/}
{/*};*/}
            <footer className="bg-blue-900 text-white px-10 py-8">
                <div className="grid md:grid-cols-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/icons/logo.png" alt="Logo" className="h-6" />
                            <span className="text-xl font-bold">DEECARE</span>
                        </div>
                        <p className="text-sm">
                            High-level experience in assisting and development knowledge, producing quality work.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Follow us</h4>
                        <p className="text-sm">Call us</p>
                        <p className="text-sm">+1 800 854-36-00</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Our Services</h4>
                        <ul className="text-sm space-y-1">
                            <li>Book Appointment</li>
                            <li>Hospital Review</li>
                            <li>Find a doctor</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Site Information</h4>
                        <ul className="text-sm space-y-1">
                            <li>Privacy Policy</li>
                            <li>FAQ</li>
                            <li>Terms</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-xs mt-8">© 2025 DeeCare</div>
            </footer>
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
    const {scrollXProgress} = useScroll({
        container: targetRef,
        axis: "x",
    });

    const x = useTransform(scrollXProgress, [0, 1], ["0%", "-70%"]);

    return (
        <div
            ref={targetRef}
            className="relative w-full overflow-x-auto whitespace-nowrap scrollbar-hide flex"
        >
            <motion.div style={{x}} className="flex gap-4 py-10">
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
