import { Link } from "react-router-dom";
import React, { useState } from 'react';
const FindDoctor = () => {

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      id: 1,
      name: "Dr.Apple Mac",
      department: "Cardiology",
      photo: "images/Dr_Apple.jpg",
      specialization: "Interventional Cardiology",
    },
    {
      id: 2,
      name: "Dr.Banana Choco",
      department: "Neurology",
      photo: "images/Dr_Banana.jpg",
      specialization: "Movement Disorders",
    },
    {
      id: 3,
      name: "Dr.Orange Juice",
      department: "Pediatrics",
      photo: "images/Dr_Orange.jpg",
      specialization: "Pediatric Immunology",
    },
    {
      id: 4,
      name: "Dr.StrawBerry ShortCake",
      department: "Orthopedics",
      photo: "images/Dr_Strawberry.jpg",
      specialization: "Sports Medicine",
    },
    {
      id: 5,
      name: "Dr.Durian Thailand",
      department: "Orthopedics",
      photo: "images/Dr_Durian.jpg",
      specialization: "King of fruit",
    },
    {
      id: 6,
      name: "Dr.Mango Teen",
      department: "Orthopedics",
      photo: "images/Dr_Mango.jpg",
      specialization: "Queen of fruit",
    },
  ];

  const toggleDetails = (id) => {
    if (selectedDoctor === id) {
      setSelectedDoctor(null);
    } else {
      setSelectedDoctor(id);
    }
  };

  return (
    <>
    <div>
      <div className="hidden md:block">   
       <button >
        <Link to="/FilterBar"> <img src="icons/Back.png" className='fixed mx-15 my-15 lg:35 xl:mx-50 bottom-1 left-1 rounded-4xl h-15 w-15 object-cover'></img> </Link>
      </button>
      </div>

      <div className="w-auto mt-15 container object-center justify-self-center ">

      <div >
                <div className=" justify-between w-auto bg-pri">
                  <form action="/FindDoctor" className="flex justify-between">
                  <input type="text" placeholder="Search Doctor"
                  
                  className=" bg-pri text-white container px-4 outline-0
                  h-9 w-90 sm:w-120 md:w-130">
                  </input>
                  <div className="justify-end">
                    <button type="submit" className="justify-items-center bg-pri hover:bg-blue-700 duration-300 py-2 w-9"><img src="icons/search.png" className=' h-5 w-5 object-cover'></img></button>
                    <Link to="/FilterBar">
                    <button className="p-2 object-left bg-pri  hover:bg-blue-700 duration-300">
                      <img src="icons/filter.png" className=' h-5 w-5 object-cover'></img></button>
                    </Link>
                  </div>
                  </form>
                 
                  </div>
              </div>
      <ul className="space-y-4 p-5 bg-light-blue mt-5">
        {doctors.map((doctor) => (
          <li 
            key={doctor.id}
            className="bg-white rounded-lg overflow-hidden"
          >
            <div className="flex items-center p-3 transition">
              <div className="flex-shrink-0 ">
                <img 
                  src={doctor.photo} 
                  alt={`Photo of ${doctor.name}`}
                  className="w-25 h-25 rounded-full object-cover"
                />
              </div>
              <div className="ml-3 flex-grow">
                <h2 className=" font-semibold text-gray-800">{doctor.name}</h2>
                <p className="text-gray-600 text-sm">{doctor.department}</p>
               
              </div>
              <div className="flex-col">
              <Link to="/Timeslot">
              <div>
                  <p className="w-30 py-2 text-sm bg-yellow text-white text-center rounded-lg hover:bg-amber-500 duration-200 transition mr-2 ">
                    Select Doctor
                  </p>
              </div>
              </Link>
              <button 
                onClick={() => toggleDetails(doctor.id)}
                className="mt-2 w-30 py-1 text-pri border-1 text-sm text-center rounded-lg hover:text-white hover:bg-pri duration-300 transition"
              >
                {selectedDoctor === doctor.id ? "Hide Details" : "View Details"}
              </button>
              </div>
            </div>
            {selectedDoctor === doctor.id && (
              <div className="p-4 text-sm">
                <div className="text-gray-700 ml-2">Specialization : {doctor.specialization}</div>
                <div className="text-gray-700 ml-2">I think it should have more detail hmmmmm</div>
                {/* doctor detail เดี๋ยวมาใส่เพิ่ม  */ }
                <div className="mt-4 text-center">
              
                </div>
              </div>
            )}
          </li>
        ))}
        <footer>
        <div className="my-5 sm:my-10 text-center text-2xl text-gray-700 ">
          End of search results
        </div>
      </footer>
      </ul>
      
    </div>
    
    </div>
    
    
    </>
  );
};

export default FindDoctor;