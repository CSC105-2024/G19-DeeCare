import React from 'react'
import { IconBrandInstagram } from '@tabler/icons-react'
import { IconBrandFacebook } from '@tabler/icons-react';
import { IconPhone } from '@tabler/icons-react';
const Footer = () => {
  return (
    <>
        {/* blue section */}
        <footer className="bg-p1 py-14 px-6">
            <div className="grid sm:grid-cols-6 grid-cols-2 min-h-[300px] gap-1 text-white font-roboto text-wrap">
            {/* Left part -col1 */}
            <div className="container col-span-2 font-">
                {/* logo part */}
                <a href="/">
                <img 
                src="/icons/deecare-logo-transparent.png" alt="Deecare Logo" 
                className="sm:w-[164px] w-[124px] "/>
                </a>
                {/* text */}
                <p className="py-2.5 text-[14px] font-normal">High level experience in assisting  and development knowledge, producing quality work.
                </p>
                <p className="my-2.5 text-[14px]"><hr /></p>
                <p className="text-[14px]">© 2025 DeeCare</p>
            </div>

            {/* col2 - contact*/}
            <div className="sm:px-5 text-wrap">
                {/* Follow us */}
                <h2 className="font-medium pb-3 text-[18px]">Follow us</h2>
                <div className="grid grid-cols-3   pb-3">
                <IconBrandInstagram stroke={2} size={24}/>
                <IconBrandFacebook stroke={2} size={24}/>

                <img src="/icons/line.png" alt="line icon" className="h-[24px]"/>
                <img src="/icons/facebook.png" alt="fb icon" className="h-[24px]"/>
                </div>
                {/* call us */}
                <div className="">
                    <p className="font-medium pb-3 text-[18px]">Call us</p>
                    <p className='flex flex-col'>
                        <IconPhone stroke={2} />
                        <span className='text-[14px]'>+XX XXX XXXX</span>
                    </p>
                
                </div>
            </div>
            {/* col3 - our service*/}
            <div className="flex-col text-wrap sm:px-5">
                <h2 className='text-[18px]'>Our Services</h2>
                <a href="/FindDoctor" className='text-[14px]'>Book Appointment</a><br />
                <a href="/Event" className='text-[14px]'>Hospital Event</a>
            </div>

            {/* col-4 map */}
            <div className="sm:px-5 text-wrap">
                <h2 className='text-[18px] font-medium'>Map and Direction</h2>
                <img src="" alt="map" />
                
            </div>

            {/* col-5 site info */}
            <div className='sm:px-5 text-wrap'>
                <h2 className='text-[18px]'>Site Information</h2>
                <p className='text-[14px]'>About Us</p>
                <p className='text-[14px]'>Privacy Policy</p>
                <p className='text-[14px]'>FAQs</p>
                <p className='text-[14px]'>Contact Us</p>
            </div>
            </div>
        </footer >
    </>
    
  );
};

export default Footer