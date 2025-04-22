import { input } from "framer-motion/client";
import { useState } from "react";
import { Link } from "react-router-dom";

const UserDetail = () => {
  const[isEdit, setIsEdit] = useState(false);
  const[formdata, setFormData] = useState({
    firstName: "Oreo",
    lastName: "Milk",
    birthDate: "30 Feburary 2077",
    chronic: "-",
    allergy: "-",
    phone: "099-999-9999",
    age: "-57",
    gender: "male",
    blood: "AB+",
    emergencyName: "Crispy Benyapon",
    relationship: "Food",
    emergencyPhone: "064-824-1987",
    email: "Benyapon.crabee@gmail.com"
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
       ...prev, [name]: value
    }))
  };
  const handleSave = () => {
    setIsEdit(false);
  };

  return (
    <div className="flex flex-col lg:flex-row  justify-center">
      {/*profile and appointment*/}
        <div>
          <div className="bg-gradient-to-b from-cyan-400 to-blue-600 m-5 p-1 w-115 rounded-xl hover:from-blue-500 hover:to-violet-600 hover:shadow-indigo-700 hover:shadow-lg ">
          <div className="bg-white w-113  flex items-center p-2 transition rounded-lg">
              <img 
                src="images/UserProfile.JPG" 
                className="w-30 h-30  bg-gray-200 rounded-full object-cover"
              />
            <div className="ml-5 flex-grow">
            <h2 className="text-lg font-semibold text-gray-800">User123456</h2>
            <p className="text-gray-600">ID:1123456789100</p>
            </div>
          </div>
          </div>

          <div className="m-5 w-119 max-h-75 overflow-auto">
            <div className="bg-pri py-2 pl-4 text-white">Appointment Reminder</div>
          <div className="bg-light-blue p-4">
          <ul className="space-x-2">
            <div className="bg-white rounded-xl p-3 w-107 mb-4">
            <div className="flex items-center ">
              <div className="flex-shrink-0 ">
                <img 
                  src="images/Dr_Apple.jpg" 
                  className="w-30 h-30 m-3 rounded-full object-cover"
                />
              </div>
              <div className="ml-3 flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">Dr.Apple Mac</h2>
                <p className="text-gray-600 text-xs">Date : XX/XX/XX</p>
                <p className="text-gray-600 text-xs">Time : XX:XX AM</p>
                <p className="text-gray-600 text-xs">At SIT-building 2rd floor  room 203</p>
                <p className="text-red-600">3 days left</p>
              </div>
            </div>
            <div>
                  <p className="w-auto mx-2 py-2 bg-gradient-to-tr from-pri to-blue-400  text-white text-center rounded-lg hover:bg-gradient-to-bl transition font-semibold">
                    More Details
                  </p>
              </div>
            </div> 
            <div className="bg-white rounded-xl p-3 mb-4 w-107">
            <div className="flex items-center ">
              <div className="flex-shrink-0 ">
                <img 
                  src="images/Dr_Apple.jpg" 
                  className="w-30 h-30 m-3 rounded-full object-cover"
                />
              </div>
              <div className="ml-3 flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">Dr.Apple Mac</h2>
                <p className="text-gray-600 text-xs">Date : XX/XX/XX</p>
                <p className="text-gray-600 text-xs">Time : XX:XX AM</p>
                <p className="text-gray-600 text-xs">At SIT-building 2rd floor  room 203</p>
                <p className="text-red-600">5 days left</p>
              </div>
            </div>
            <div>
                  <p className="w-auto mx-2 py-2 bg-gradient-to-tr from-pri to-blue-400  text-white text-center rounded-lg hover:bg-gradient-to-bl transition font-semibold">
                    More Details
                  </p>
              </div>
            </div>
          </ul>
          </div>
          </div>
        </div>

      {/* info */}
        <div className="bg-light-blue p-5 w-119 my-5  mx-5 rounded-2xl max-h-120 overflow-auto">
          <div className="flex flex-row">
            <div className="font-bold text-2xl mt-1 ml-2">Patient Information</div>
            <div
            onClick={() => setIsEdit(!isEdit)}
            className="text-xl bg-pri px-3 py-1 ml-25 rounded-lg border-2 border-pri text-white hover:text-pri hover:bg-white ">
              {isEdit ? "Save" : "Edit"}
            </div>
          </div>

          <div className="mx-2 my-2">
            <div className="text-pri ml-1">First Name</div>
            <div className="bg-white p-2 px-4 rounded-lg w-auto">Oreo</div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Last Name</div>
            <div className="bg-white p-2 px-4 rounded-lg w-auto">Milk</div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Birth Date</div>
            <div className="bg-white p-2 px-4 rounded-lg w-auto">30 Feburary 2077</div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Chronic disease</div>
            <div className="bg-white p-2 px-4 rounded-lg w-auto">-</div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Allergic drugs</div>
            <div className="bg-white p-2 px-4 rounded-lg w-auto">-</div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Telephone Number</div>
            <div className="bg-white p-2 px-4 rounded-lg w-auto">099-999-9999</div>
          </div>

          <div className="flex flex-row">
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Age</div>
            <div className="bg-white p-2 px-4 rounded-lg w-15">-57</div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Gender</div>
            <div className="bg-white p-2 px-4 rounded-lg w-25">male</div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">blood type</div>
            <div className="bg-white p-2 px-4 rounded-lg w-25">AB+</div>
          </div>
          <div className="mx-2 my-2 ">
            <div className="text-pri ml-1 "></div>
            <div className="bg-pri p-1.5 px-5.5 rounded-lg mt-6  border-2 border-pri text-white hover:text-pri hover:bg-white ">More...</div>
          </div>
          </div>

          <div className="font-bold text-2xl mb-2 mt-10 ml-2">EMERGENCY CONTACT</div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Name</div>
            <div className="bg-white p-2 px-4 rounded-lg w-auto">Crispy Benyapon</div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Relationship</div>
            <div className="bg-white p-2 px-4 rounded-lg w-auto">Food</div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Telephone Number</div>
            <div className="bg-white p-2 px-4 rounded-lg w-auto">064-824-1987</div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">EMAIL</div>
            <div className="bg-white p-2 px-4 rounded-lg w-auto">Benyapon.crabee@gmail.com</div>
          </div>
          
        </div>
    </div>
  );
};

export default UserDetail;

