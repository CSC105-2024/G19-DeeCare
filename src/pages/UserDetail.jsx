import { Link } from "react-router-dom";

const UserDetail = () => {
  return (
    <>
    <div >
      <div className="text-4xl">Profile page</div>
      <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>   
       <button onclick="alert">
        <p>edit</p>
      </button>
      </div>
      <div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>   
       <button>
        <Link to="/Home"> back to home page </Link>
      </button>
      </div>
    </div>
    </>
  );
};

export default UserDetail;