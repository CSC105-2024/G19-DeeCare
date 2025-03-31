import { Link } from "react-router-dom";

const Admin_Appointment = () => {
  return (
    <>
    <div >
      <div className="text-4xl">Admin_Appointment page</div>
      <div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/Admin_post"> post event </Link>
      </button>
      </div>
    </div>
    </>
  );
};

export default Admin_Appointment;