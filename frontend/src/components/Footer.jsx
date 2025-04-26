import React from 'react'
const Footer = () => {
  return (
    <>
        {/* blue section */}
        <footer className="bg-pri max-w-screen max-h-screen overflow-x-hidden
        pt-8 sm:pt-14 px-5
        ">
            {/* Footer info */}
            <div className="grid md:grid-cols-6 sm:grid-cols-2 gap-3 sm:gap-10 h-full text-white text-wrap pb-10 w-full">
                {/* Left part -col1 */}
                <div className="col-span-2 sm:pl-5 pr-3 pb-5">
                    {/* logo part */}
                    <a href="/">
                        <img src="/icons/fullLogo.png" 
                        alt="Deecare Logo" 
                        className="sm:w-[164px] w-[124px] pb-3 sm:pb-4"/>
                    </a>
                    {/* text */}
                    <p className="text-sm">
                        Combining innovation with care, we strive to simplify healthcare access through reliable and user-centered technology.
                        {/* Trusted by patients. Backed by care. */}
                    </p>
                </div>

                {/* col2 - contact*/}
                <div className="sm:px-5 text-wrap pr-5">
                    {/* Follow us */}
                    <h2 className="font-medium pb-3 sm:text-lg text-base">
                        Follow us
                    </h2>
                    <div className="flex gap-4 pb-3">
                        <img src="/icons/ig-white.svg" alt="icon instagram" />
                        <img src="/icons/fb-white.svg" alt="icon facebook" />
                        <img src="/icons/line-white.svg" className="w-6" alt="icon line"/>
                    </div>

                    {/* call us */}
                    <h2 className='pb-3 font-medium sm:text-lg text-base'>
                        Call Us
                    </h2>
                    <div className="flex items-start gap-1 sm:gap-2 pb-3">
                        <img src="/icons/phone-white.svg" alt="icon phone" className='w-5'/>
                        <p className='text-sm pr-5'>+1 800 854-36-00</p>
                    </div>
                </div>

                {/* col3 - our service*/}
                <div className="flex-col text-wrap sm:px-5 pb-3 pr-5">
                    <h2 className='sm:text-lg text-base pb-3 font-medium'>
                        Our Services
                    </h2>
                    <a href="/FindDoctor"
                    className='text-sm'
                    >Book Appointment</a><br />
                    <a href="#eventCard" className='text-sm text-white'>
                        Hospital Event
                    </a><br />
                    <p className='text-sm'>Hospital Review</p>
                </div>

                
                {/* col-4 site info */}
                <div className='sm:px-5 text-wrap pb-3 pr-5'>
                    <h2 className='sm:text-lg text-base pb-3 font-medium'>Site Information</h2>
                    <p className='text-[14px]'>About Us</p>
                    <p className='text-[14px]'>Privacy Policy</p>
                    <p className='text-[14px]'>FAQs</p>
                    <p className='text-[14px]'>Contact Us</p>
                </div>

                {/* col-5 map */}
                <div className="sm:px-5 text-wrap">
                    {/* <h2 className='sm:text-lg text-base font-medium pb-3'>
                    </h2>   */}
                    <div className="w-full h-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8940444191626!2d100.53244677600274!3d13.72486419791473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f2dd8fd00fb%3A0x64d690448dcd23b6!2sBNH%20Hospital!5e0!3m2!1sen!2sth!4v1745306013121!5m2!1sen!2sth"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        >
                        </iframe>
                    </div>
                </div>

            </div>

            <div className="px-5 py-3 w-full bottom-0 overflow-x-hidden">
                <div className='h-[1px] pr-10 bg-white'></div>
                <p className='sm:text-lg text-base flex items-center justify-center  text-white pt-3'>© 2025 DeeCare</p>
            </div>
        </footer >
    </>
    
  );
};

export default Footer