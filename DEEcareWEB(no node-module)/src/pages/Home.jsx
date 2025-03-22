import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="text-4xl">Home page</div>
      <div className='float-left px-4 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/FindDoctor">Appointment</Link>
      </button>
      </div>
    </>
  );
};

export default Home;