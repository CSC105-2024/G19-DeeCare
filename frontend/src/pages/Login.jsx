import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
    <div >
      <div className="text-4xl">Login page</div>
      <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>
       <button>
        <Link to="/UserDetail">Login</Link>
      </button>
      </div>
      <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>
       <button>
        <Link to="/Admin_Appointment">Admin Login</Link>
      </button>
      </div>
      <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>
       <button>
        <Link to="/Register">Don't have account yet?</Link>
      </button>
      </div>
      <div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>
       <button>
        <Link to="/Confirm"> back </Link>
      </button>
      </div>
    </div>
    </>
  );
};

export default Login;