import { Link } from "react-router-dom";

const Event = () => {
  return (
    <>
    {/* <div >
      <div className="text-4xl">Search page</div>
      <div className='px-4 w-17 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/Home"> back </Link>
      </button>
      </div>
    </div> */}
    {/* Event date and place */}
    <div>
      {/* day and month */}
      <div>
        <p>22</p>
        <p>Jan</p>
      </div>
      {/* detail */}
      <div>
        <h1>Medical Fair Asia</h1>
        <p>31 August – 2 September 2022 (Physical), 3 – 9 September (Digital, Online)</p>
        <p>Marina Bay Sands, Singapore</p>
      </div>
    </div>
    {/* image */}
    <div>
      <img src="" alt="" />
    </div>
    {/* contact details */}
    <div>
      <p>Messe Düsseldorf Asia</p>
      <p><a href="https://www.medicalfair-asia.com/"></a></p>
      <p>0812345678</p>
      <p>daphne@mda.com.sg</p>
      <p>www.linkedin.com/company/medicalfairasia/</p>
    </div>
    {/* more detail */}
    <p>With a well-established history since 1997, the 14th edition of MEDICAL FAIR ASIA 2022 continues to focus on Hospital, Diagnostics, 
    Pharmaceutical, Medical & Rehabilitation Equipment & Supplies for manufacturers, suppliers, distributors and trade buyers from the medical and healthcare sector to conduct business. The leading medical and healthcare exhibition will continue to feature the latest medical technology and innovations, and healthcare equipment and supplies, to provide the industry a platform with the best business opportunities to navigate the dynamic marketplace in this region.</p>
    </>
  );
};

export default Event;