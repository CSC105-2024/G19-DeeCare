import { Link } from "react-router-dom";
import React, { useState } from 'react';

const filterBar = () => {

  const [selectedDept, setSelectedDept] = useState(null);
  
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
  
  return (
    <div className="p-6 max-w-2xl mx-auto mt-15">
      <div>   
             <button >
              <Link to="/Home"> <img src="src/icons/backIcon.png" className='fixed m-10 bottom-1 left-1 rounded-4xl h-15 w-15 object-cover'></img> </Link>
            </button>
      </div>
      <div className="">
              <div className="">
              <input type="text" placeholder="Search Doctor" 
              className="min-sm:w-100 md:w-130 lg:w-130 container py-1 px-4  bg-blue-400 rounded-lg">
              </input>
              
              <button type="submit" className="p-2 ml-4 mt-5 bg-blue-400 rounded-full"><img src="src/icons/search.png" className='h-5 w-5 object-cover'></img></button>
              <Link to="/Filter">
              <button className="p-2 ml-4 bg-blue-400 rounded-full"><img src="src/icons/filter.png" className='h-5 w-5 object-cover'></img></button>
              </Link>
              </div>
      </div>
      <h2 className="mt-3 ml-1 text-blue-900 font-bold">Search by Department</h2>
      <div className="bg-blue-200 grid grid-cols-4 gap-y-5 gap-x-3 p-4 rounded-lg mt-1">
        {departments.map((de) => (
          <Link to="/FindDoctor">
          <div className="bg-white  w-auto py-4 rounded-lg ">
            <h3 className="text-center text-blue-800">{de.name}</h3>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );

};

export default filterBar;
