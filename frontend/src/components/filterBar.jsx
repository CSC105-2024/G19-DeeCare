import { Link,useNavigate } from "react-router-dom";
import React, { useState } from 'react';

const filterBar = () => {
  const [name,setname] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);

  const navigate = useNavigate();
  
  const departments = [
    { id: 1, name: 'Emergency' },
    { id: 2, name: 'Cardiology'},
    { id: 3, name: 'Pediatrics'},
    { id: 4, name: 'Orthopedics'},
    { id: 5, name: 'Neurology'},
    { id: 6, name: 'Oncology'},
    { id: 7, name: 'Obstetrics'},
    { id: 8, name: 'Radiology' },
    { id: 9, name: 'Surgery'},
    { id: 10, name: 'Gynecology'}
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      navigate(`/FindDoctor?name=${encodeURIComponent(name.trim())}`);
    }
    else{
      navigate("/FindDoctor");
    }
  };

  return (
    <div className=" bg-gradient-to-t from-blue-300 to-white">
    <div className=" max-w-2xl mx-auto ">
      <div className="hidden md:block">   
            <button >
              <Link to="/"> <img src="icons/Back.png" className='fixed mx-15 my-15 lg:35 xl:mx-50 bottom-1 left-1 rounded-full h-15 w-15 object-cover '></img> </Link>
            </button>
      </div>
        <div className="mt-15 max-w-screen" >
          <div className=" justify-between  bg-pri">
            <form onSubmit={handleSubmit} className=" justify-between flex flex-row">
                              <input type="text" placeholder="Search Doctor" value={name}
                              onChange={(e) => setname(e.target.value)}
                              className="w-auto bg-pri text-white container px-4 outline-0
                              h-9  " >
                              </input>
                              <div className="flex flex-row justify-end">
                                <button type="submit" className="justify-items-center bg-pri hover:bg-blue-700 duration-300 py-2 w-9"><img src="icons/search.png" className=' h-5 w-5 object-cover'></img></button>
                                <Link to="/FilterBar">
                                <button className="p-2 object-left bg-pri  hover:bg-blue-700 duration-300"><img src="icons/filter.png" className=' h-5 w-5 object-cover'></img></button>
                                </Link>
                              </div>
                              </form>
           
            </div>
        </div>
      <h2 className="mt-3 mb-1 ml-1 text-blue-900 font-bold">Search by Department</h2>
      <div className="bg-light-blue grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-3 p-4 justify-items-center">
        {departments.map((de) => (
          <Link to={`/FindDoctor?department=${de.name}`}>
          <div className="bg-white  w-45 py-8 rounded-lg hover:shadow-xl hover:shadow-gray-400 duration-200 ">
            <div className="text-center text-pri  ">{de.name}</div>
          </div>
          </Link>
        ))}
        <div>
          <Link to="/FindDoctor">
          <button className="border-2 border-pri bg-white  w-45 py-8 rounded-lg hover:text-white 
          hover:bg-pri duration-500 text-pri ">
            skip ?
          </button>
          </Link>
        </div>
      </div>
      
    </div>
    </div>
  );

};

export default filterBar;
