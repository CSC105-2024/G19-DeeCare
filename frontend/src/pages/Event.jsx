import { Link } from "react-router-dom";

const Event = () => {
  return (
    <>
    {/* whole page */}
    <div className="sm:m-[64px] m-[32px]">

      {/* event brief */}
      <div className="flex sm:justify-start items-center h-[128px] sm:flex-row flex-col">
        {/* event mobile topic */}
        <h1 className="font-semibold hidden ">
          Medical Fair Asia 2022
        </h1>

        {/* event date */}
        <div className="sm:w-[128px] w-full sm:h-[128px] sm:mr-[42px] flex justify-center items-center bg-light-blue rounded-2xl flex-col font-medium py-3">
          <p>22</p>
          <p>Jan</p>
        </div>


        {/* detail */}
        <div>
          {/* event desktop topic */}
          <h1 className="sm:font-semibold hidden sm:block">
            Medical Fair Asia 2022
          </h1>

          {/* Event date */}
          <div className="flex">
            <img 
              src="/icons/calendar-event.svg" alt="icons calendar-event" />
            <p className="ml-2 break-words">
              31 August - 2 September 2022 (Physical), 3 - 9 September (Digital, Online)
            </p>
          </div>

          {/* place */}
          <div className="flex">
            <img 
              src="/icons/map-pin.svg" 
              alt="icon map-pin"/>
            <p className="ml-2 break-words">
              Marina Bay Sands, Singapore
            </p>
          </div>

        </div>

      </div>


      {/* event image */}
      <div className="bg-light-blue flex justify-center items-center my-[32px]">
        <img 
          src="/images/event.jpg" 
          alt="Event Medical Fair Asia 2022" className="h-[300px]" />
      </div>
      

      {/* event contact */}
      <div>
        {/* event place */}
        <div className="flex">
          <img 
            src="/icons/map-pin.svg" 
            alt="icon map-pin"/>
          <p className="ml-2 break-words">  
            Messe Düsseldorf Asia
          </p>
        </div>
        
        {/* event website */}
        <div className="flex">
          <img 
            src="/icons/link.svg" 
            alt="website-link" />
          <a href="https://www.medicalfair-asia.com/">
            <p className="ml-2 break-words">
              https://www.medicalfair-asia.com/
            </p>
          </a>
        </div>

        {/* event contact*/}
        <div className="flex">
          <img 
            src="/icons/phone.svg"       alt="icon-phone"/>
          <p className="ml-2"> 
            0812345678
          </p>
        </div>
        
        {/* event mail */}
        <div className="flex">
          <img 
            src="/icons/mail.svg" 
            alt="icon-mail"/>
          <p className="ml-2 break-words">  
            daphne@mda.com.sg
          </p>
        </div>
        
        {/* event linkedin */}
        <div className="flex">
          <img 
            src="/icons/at.svg" 
            alt="icon-at"/>
          <p className="ml-2 break-words"> 
            www.linkedin.com/company/medicalfairasia
          </p>
        </div>
      </div>


      {/* more detail */}
      <p className="mt-[32px] break-words">
        With a well-established history since 1997, the 14th edition of MEDICAL FAIR ASIA 2022 continues to focus on Hospital, Diagnostics, Pharmaceutical, Medical & Rehabilitation Equipment & Supplies for manufacturers, suppliers, distributors and trade buyers from the medical and healthcare sector to conduct business. The leading medical and healthcare exhibition will continue to feature the latest medical technology and innovations, and healthcare equipment and supplies, to provide the industry a platform with the best business opportunities to navigate the dynamic marketplace in this region.
      </p>
    </div>
    </>
  );
};

export default Event;

{/* <div >
      <div className="text-4xl">Search page</div>
      <div className='px-4 w-17 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/Home"> back </Link>
      </button>
      </div>
    </div> */}