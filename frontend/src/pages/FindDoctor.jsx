import { Link , useSearchParams,useNavigate } from "react-router-dom";
import { findAllDoc, findDoctorByde, findDoctorBySearch } from "../api/getDoctors.js";
import React, { useState,useEffect } from 'react';
const FindDoctor = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [Doctor, setDoctor] = useState([]);
  const [name,setname] = useState('');

  const navigate = useNavigate();

  const search = searchParams.get('department');
  const searchname = searchParams.get('name');

  useEffect(() => {
    if (searchname) {
      fetchDoctorbysearch(searchname);
    } else if (search) {
      fetchDoctorData(search);
    }else{
      fetchAllDoctor();
    }
  }, [search, searchname]);

  const fetchAllDoctor = async () => {
      try{
        console.log();
        const response = await findAllDoc();
        if (response.data.success) {
          setDoctor(response.data.data);
        } else {
          console.error("Failed to fetch doctor");
        }
      } catch (e) {
        console.error("Error fetching doctor:", e);
      } finally {
        // setLoading(false);
      }
    };

    const fetchDoctorbysearch = async (name) => {
      try{
        console.log(name);
        const response = await findDoctorBySearch(name);
        if (response.data.success) {
          setDoctor(response.data.data);
        } else {
          console.error("Failed to fetch doctor");
        }
      } catch (e) {
        console.error("Error fetching doctor:", e);
      } finally {
        // setLoading(false);
      }
    };
  
  const fetchDoctorData = async (de) => {
      try{
        console.log(de);
        const response = await findDoctorByde(de);
        if (response.data.success) {
          setDoctor(response.data.data);
        } else {
          console.error("Failed to fetch doctor");
        }
      } catch (e) {
        console.error("Error fetching doctor:", e);
      } finally {
        // setLoading(false);
      }
    };
    

  /*const doctors = [
    {
      id: 1,
      name: "Dr.One pen",
      department: "Cardiology",
      photo: "images/Dr1.jpg",
      specialization: "Interventional Cardiology",
    },
    {
      id: 2,
      name: "Dr.Double Wilson",
      department: "Neurology",
      photo: "images/Dr2.jpg",
      specialization: "Movement Disorders",
    },
    {
      id: 3,
      name: "Dr.Pongsak",
      department: "Pediatrics",
      photo: "images/Dr3.jpg",
      specialization: "Pediatric Immunology",
    },
    {
      id: 4,
      name: "Dr.John Carter",
      department: "Orthopedics",
      photo: "images/Dr4.jpg",
      specialization: "Sports Medicine",
    },
    {
      id: 5,
      name: "Dr.Jennifer lopez",
      department: "Orthopedics",
      photo: "images/Dr5.jpg",
      specialization: "King of fruit",
    },
    {
      id: 6,
      name: "Dr.Siriporn",
      department: "Orthopedics",
      photo: "images/Dr6.jpg",
      specialization: "Queen of fruit",
    },
  ];*/

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      navigate(`/FindDoctor?name=${encodeURIComponent(name.trim())}`);
      alert("Here is a list of Doctors!")
    }
    else{
      fetchAllDoctor();
    }
  };

  const toggleDetails = (id) => {
    if (selectedDoctor === id) {
      setSelectedDoctor(null);
    } else {
      setSelectedDoctor(id);
    }
  };

  return (
    <>
    <div className="bg-gradient-to-t from-blue-300 to-white">
      <div className="hidden md:block">   
       <button >
        <Link to="/FilterBar"> <img src="icons/Back.png" className='fixed mx-15 my-15 lg:35 xl:mx-50 bottom-1 left-1 rounded-4xl h-15 w-15 object-cover bg-white'></img> </Link>
      </button>
      </div>

      <div className="max-w-150 mt-15 container object-center justify-self-center ">

      <div className="max-w-screen" >
                <div className=" justify-between  bg-pri">
                  <form onSubmit={handleSubmit} className=" justify-between flex flex-row">
                  <input type="text" placeholder="Search Doctor" value={name}
                  onChange={(e) => setname(e.target.value)}
                  className=" bg-pri text-white container px-4 outline-0
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
      <ul className="space-y-4 p-5 bg-light-blue mt-5 max-h-screen overflow-y-scroll">
        {Doctor.map((doctor) => (
          <li 
            key={doctor.id}
            className="bg-white rounded-lg overflow-hidden"
          >
            <div className="flex items-center  p-3 transition">
              <div className="flex-shrink-0 ">
                <img 
                  src={doctor.DRimage} 
                  alt={`Photo of ${doctor.name}`}
                  className="w-25 h-25 rounded-full object-cover"
                />
              </div>
              <div className="ml-3 flex-grow ">
                <h2 className="w-30 text-xs sm:text-lg sm:w-auto font-semibold text-gray-800 truncate">{doctor.name}</h2>
                <p className="text-gray-600 text-sm">{doctor.department}</p>
               
              </div>
              <div className="flex-col ">
              <Link to="/Timeslot">
              <div>
                  <p className="hidden sm:block w-30 py-2 ml-2 text-sm bg-yellow text-white text-center rounded-lg hover:bg-amber-500 duration-200 transition mr-2 ">
                    Select Doctor
                  </p>
              </div>
              </Link>
              <Link to="/Timeslot">
              <div>
                  <p className="sm:hidden w-8 py-2 ml-2 text-sm bg-yellow text-white text-center rounded-lg hover:bg-amber-500 duration-200 transition mr-2 ">
                    /
                  </p>
              </div>
              </Link>
              <button 
                onClick={() => toggleDetails(doctor.id)}
                className="hidden sm:block mt-1 w-30 py-1 ml-2 text-pri border-1 text-sm text-center rounded-lg hover:text-white hover:bg-pri duration-300 transition"
              >
                {selectedDoctor === doctor.id ? "Hide Details" : "View Details"}
              </button>
              <button 
                onClick={() => toggleDetails(doctor.id)}
                className="sm:hidden mt-1 w-8 py-1 ml-2 text-pri border-1 text-sm text-center rounded-lg hover:text-white hover:bg-pri duration-300 transition"
              >
                {selectedDoctor === doctor.id ? "x" : "v"}
              </button>
              </div>
            </div>
            {selectedDoctor === doctor.id && (
              <div className="p-4 text-sm">
                <div className="text-gray-700 ml-2">Specialization : {doctor.specialization}</div>
                {/* doctor detail เดี๋ยวมาใส่เพิ่ม  */ }
                <div className="mt-4 text-center">
              
                </div>
              </div>
            )}
          </li>
        ))}
        <footer>
        <div className="m-10 text-center text-2xl text-gray-700">
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
