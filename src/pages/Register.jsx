import { Link } from "react-router-dom";

const Register = () => {
  return (
    <>
    <div >
      <div className="text-4xl">Register page</div>
      <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>   
       <button>
        <Link to="/UserDetail">Register</Link>
      </button>
      </div>
      <div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/Login"> back </Link>
      </button>
      </div>
    </div>
    </>
  );
};

export default Register;