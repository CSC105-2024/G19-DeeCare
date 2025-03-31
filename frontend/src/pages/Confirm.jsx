import { Link } from "react-router-dom";

const Confirm = () => {
  return (
    <>
    <div >
      <div className="text-4xl">Confirm page</div>
      <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>   
       <button>
        <Link to="/Login">Confirm Appointment</Link>
      </button>
      </div>
      <div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/Timeslot"> back </Link>
      </button>
      </div>
    </div>
    </>
  );
};

export default Confirm;