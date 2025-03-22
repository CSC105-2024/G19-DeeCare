import { Link } from "react-router-dom";

const FindDoctor = () => {
  return (
    <>
    <div >
      <div className="text-4xl">Search page</div>
      <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>   
       <button>
        <Link to="/Timeslot">Mr.Good doctor</Link>
      </button>
      </div>
      <div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/Home"> back </Link>
      </button>
      </div>
    </div>
    </>
  );
};

export default FindDoctor;