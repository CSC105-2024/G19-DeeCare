import { Link } from "react-router-dom";
import React, { useState } from 'react';
const FindDoctor = () => {

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      id: 1,
      name: "Dr.Apple Mac",
      department: "Cardiology",
      photo: "src/images/Dr_Apple.jpg",
      specialization: "Interventional Cardiology",
    },
    {
      id: 2,
      name: "Dr.Banana Choco",
      department: "Neurology",
      photo: "src/images/Dr_Banana.jpg",
      specialization: "Movement Disorders",
    },
    {
      id: 3,
      name: "Dr.Orange Juice",
      department: "Pediatrics",
      photo: "src/images/Dr_Orange.jpg",
      specialization: "Pediatric Immunology",
    },
    {
      id: 4,
      name: "Dr.StrawBerry ShortCake",
      department: "Orthopedics",
      photo: "src/images/Dr_Strawberry.jpg",
      specialization: "Sports Medicine",
    },
    {
      id: 5,
      name: "Dr.Durian Thailand",
      department: "Orthopedics",
      photo: "src/images/Dr_Durian.jpg",
      specialization: "King of fruit",
    },
    {
      id: 6,
      name: "Dr.Mango Teen",
      department: "Orthopedics",
      photo: "src/images/Dr_Mango.jpg",
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
      <div>   
       <button >
        <Link to="/Filter"> <img src="src/icons/backIcon.png" className='fixed m-10 bottom-1 left-1 rounded-4xl h-15 w-15 object-cover'></img> </Link>
      </button>
      </div>

      <div className="sm:w-xl md:w-2xl lg:w-2xl mt-15 container object-center justify-self-center ">

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
      <ul className="space-y-4 p-5 bg-blue-200 mt-5">
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
                  className="w-30 h-30 rounded-full object-cover"
                />
              </div>
              <div className="ml-3 flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.department}</p>
               
              </div>
              <div className="flex-col">
              <Link to="/Timeslot">
              <div>
                  <p className="w-30 py-2 bg-yellow-600 text-white text-center rounded-lg hover:bg-yellow-500 transition mr-2 font-bold">
                    Select Doctor
                  </p>
              </div>
              </Link>
              <button 
                onClick={() => toggleDetails(doctor.id)}
                className="mt-2 w-30 py-0.5 text-blue-800 border-1  text-center rounded-lg hover:underline  transition"
              >
                {selectedDoctor === doctor.id ? "Hide Details" : "View Details"}
              </button>
              </div>
            </div>
            {selectedDoctor === doctor.id && (
              <div className="p-4">
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
        <div className="m-10 text-center text-2xl font-bold text-gray-700">
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
