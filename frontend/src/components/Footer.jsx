import React from 'react'
const Footer = () => {
  return (
    <>
        {/* blue section */}
        <footer className="bg-pri w-full h-min-screen pt-14 px-[32px]">
            <div className="grid md:grid-cols-6 sm:grid-cols-2 sm:gap-10 min-h-S[300px] text-white text-wrap pb-10 ">
                {/* Left part -col1 */}
                <div className="col-span-2 sm:pl-5 pr-3">
                {/* logo part */}
                    <a href="/">
                        <img src="/icons/fullLogo.png" 
                        alt="Deecare Logo" 
                        className="sm:w-[164px] w-[124px] pb-3"/>
                    </a>
                    {/* text */}
                    <p className="text-sm">High level experience in assisting and development knowledge, producing quality work.</p>
                </div>

                {/* col2 - contact*/}
                <div className="sm:px-5 text-wrap">
                    {/* Follow us */}
                    <h2 className="font-medium pb-3 text-[18px]">
                        Follow us
                    </h2>
                    <div className="flex gap-2 pb-3">
                        <img src="/icons/ig-white.svg" alt="icon instagram" />
                        <img src="/icons/fb-white.svg" alt="icon facebook" />
                        <img src="/icons/line-white.svg" className="w-6" alt="icon line"/>
                    </div>

                    {/* call us */}
                    <h2 className='pb-3 font-medium '>
                        Call Us
                    </h2>
                    <div className="flex gap-2 pb-3">
                        <img src="/icons/phone-white.svg" alt="icon phone" className='w-6'/>
                        <p className='text-[14px]'>+1 800 854-36-00</p>
                    </div>
                </div>

                {/* col3 - our service*/}
                <div className="flex-col text-wrap sm:px-5 pb-3 ">
                    <h2 className='text-[18px] pb-3 font-medium'>
                        Our Services
                    </h2>
                    <a href="/FindDoctor" className='text-sm'>
                        Book Appointment
                    </a>
                    <p className='text-sm'>Hospital Review</p>
                    <p className='text-sm'>Find a doctor</p>
                    <a href="/Event" className='text-sm'>
                        Hospital Event
                    </a>
                </div>

                {/* col-4 map */}
                <div className="sm:px-5 text-wrap">
                    <h2 className='text-[18px] font-medium pb-3'>
                        Map and Direction
                    </h2>
                    <img src="icons/map-pin.svg" alt="map" />     
                </div>

                {/* col-5 site info */}
                <div className='sm:px-5 text-wrap pb-3'>
                    <h2 className='text-[18px] pb-3 font-medium'>Site Information</h2>
                    <p className='text-[14px]'>About Us</p>
                    <p className='text-[14px]'>Privacy Policy</p>
                    <p className='text-[14px]'>FAQs</p>
                    <p className='text-[14px]'>Contact Us</p>
                </div>
            </div>

            <div className="px-5 py-3 w-full">
                <div className='h-[1px] bg-white'></div>
                <p className='text-sm flex items-center justify-center  text-white pt-3'>© 2025 DeeCare</p>
            </div>
            
            
        </footer >
    </>
    
  );
};

export default Footer