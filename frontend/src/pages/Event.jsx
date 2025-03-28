import { Link } from "react-router-dom";

const Event = () => {
  return (
    <>
    <div >
      <div className="text-4xl">Search page</div>
      <div className='px-4 w-17 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/Home"> back </Link>
      </button>
      </div>
    </div>
    </>
  );
};

export default Event;