import { Link } from "react-router-dom";

const Timeslot = () => {
  return (
    <>
    <div>
      <div className="text-4xl">time slot page</div>
      <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>   
       <button>
        <Link to="/Confirm">Confirm doctor and date</Link>
      </button>
      </div>
      <div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/FindDoctor"> back </Link>
      </button>
      </div>
    </div>
    </>
  );
};

export default Timeslot;