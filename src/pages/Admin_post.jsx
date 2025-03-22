import { Link } from "react-router-dom";

const Admin_post = () => {
  return (
    <>
    <div >
      <div className="text-4xl">Admin post page</div>
      <div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/Admin_Appointment"> Appointment manage </Link>
      </button>
      </div>
    </div>
    </>
  );
};

export default Admin_post;