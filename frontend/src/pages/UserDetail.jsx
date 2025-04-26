import { useState, useEffect } from "react";

const UserDetail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctorName: "Dr.Apple Mac",
      doctorImage: "images/Dr_Apple.jpg",
      date: "XX/XX/XX",
      time: "XX:XX AM",
      location: "SIT-building 2rd floor room 203",
      daysLeft: 3
    },
    {
      id: 2,
      doctorName: "Dr.Apple Mac",
      doctorImage: "images/Dr_Apple.jpg",
      date: "XX/XX/XX",
      time: "XX:XX AM",
      location: "SIT-building 2rd floor room 203",
      daysLeft: 5
    },
    {
      id: 3,
      doctorName: "Dr.three Kaa",
      doctorImage: "images/Dr_Apple.jpg",
      date: "XX/XX/XX",
      time: "XX:XX AM",
      location: "SIT-building 2rd floor room 203",
      daysLeft: 5
    }
  ]);
  
  const [formData, setFormData] = useState({
    idNumber: "",
    firstName: "",
    lastName: "",
    dob: "",
    age: "",
    bloodType: "",
    email: "",
    phoneNumber: "",
    gender: "",
    chronicDisease: "-",
    allergicDrugs: "-",
    contactName: "",
    relationship: "",
    contactPhone: "",
    profileImage: ""
  });

  // Function to get user initials
  const getUserInitials = () => {
    const firstInitial = formData.firstName ? formData.firstName.charAt(0).toUpperCase() : "";
    const lastInitial = formData.lastName ? formData.lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };

  // Load patient data when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('patientData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    
    // Load appointments from localStorage if available
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSave = () => {
    // Save updated data to localStorage
    localStorage.setItem('patientData', JSON.stringify(formData));
    setIsEditing(false);
  };
  
  const handleDeleteClick = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = () => {
    const updatedAppointments = appointments.filter(
      appointment => appointment.id !== appointmentToDelete
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setShowDeleteConfirm(false);
    setAppointmentToDelete(null);
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setAppointmentToDelete(null);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({...prev, profileImage: reader.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center">
      {/*profile and appointment*/}
      <div>
        <div className="bg-gradient-to-b from-cyan-400 to-blue-600 m-5 p-1 w-115 rounded-xl hover:from-blue-500 hover:to-violet-600 hover:shadow-indigo-700 hover:shadow-lg ">
          <div className="bg-white w-113 flex items-center p-2 transition rounded-lg">
            {formData.profileImage ? (
              <img 
                src={formData.profileImage} 
                className="w-30 h-30 bg-gray-200 rounded-full object-cover"
                alt="User profile"
              />
            ) : (
              <div className="w-30 h-30 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getUserInitials()}
              </div>
            )}
            <div className="ml-5 flex-grow">
              <h2 className="text-lg font-semibold text-gray-800">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gray-600">ID: {formData.idNumber}</p>
            </div>
            {isEditing && (
              <div className="ml-auto">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="profileImage" 
                  className="cursor-pointer bg-pri text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  Change Photo
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="m-5 w-119 max-h-75 overflow-auto">
          <div className="bg-pri py-2 pl-4 text-white">Appointment Reminder</div>
          <div className="bg-light-blue p-4">
            <ul className="space-x-2">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-xl p-3 w-107 mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img 
                          src={appointment.doctorImage} 
                          className="w-30 h-30 m-3 rounded-full object-cover"
                          alt="Doctor"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <h2 className="text-lg font-semibold text-gray-800">{appointment.doctorName}</h2>
                        <p className="text-gray-600 text-xs">Date : {appointment.date}</p>
                        <p className="text-gray-600 text-xs">Time : {appointment.time}</p>
                        <p className="text-gray-600 text-xs">At {appointment.location}</p>
                        <p className="text-red-600">{appointment.daysLeft} days left</p>
                      </div>
                      <div>
                        <button 
                          onClick={() => handleDeleteClick(appointment.id)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="w-auto mx-2 py-2 bg-gradient-to-tr from-pri to-blue-400 text-white text-center rounded-lg hover:bg-gradient-to-bl transition font-semibold">
                        More Details
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-4 text-center text-gray-500">
                  No appointments scheduled
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* info */}
      <div className="bg-light-blue p-5 w-119 my-5 mx-5 rounded-2xl max-h-120 overflow-auto">
        <div className="flex flex-row">
          <div className="font-bold text-2xl mt-1 ml-2 ">Patient Information</div>
          <div
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className="text-xl bg-pri w-17 text-center py-1 ml-25 rounded-lg border-2 border-pri text-white hover:text-pri hover:bg-white cursor-pointer"
          >
            {isEditing ? "Save" : "Edit"}
          </div>
        </div>

        <div className="mx-2 my-2">
          <label className="text-pri ml-1">First Name</label>
          <div>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                className="bg-white p-2 px-4 rounded-lg w-full"
              />
            ) : (
              <div className="bg-white p-2 px-4 rounded-lg w-auto">
                {formData.firstName || "-"}
              </div>
            )}
          </div>
        </div>
        
        <div className="mx-2 my-2">
          <div className="text-pri ml-1">Last Name</div>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="bg-white p-2 px-4 rounded-lg w-full"
            />
          ) : (
            <div className="bg-white p-2 px-4 rounded-lg w-auto">
              {formData.lastName || "-"}
            </div>
          )}
        </div>
        
        <div className="mx-2 my-2">
          <div className="text-pri ml-1">Birth Date</div>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              className="bg-white p-2 px-4 rounded-lg w-full"
            />
          ) : (
            <div className="bg-white p-2 px-4 rounded-lg w-auto">
              {formData.dob ? new Date(formData.dob).toLocaleDateString() : "-"}
            </div>
          )}
        </div>
        
        <div className="mx-2 my-2">
          <div className="text-pri ml-1">Chronic Disease</div>
          {isEditing ? (
            <input
              type="text"
              name="chronicDisease"
              value={formData.chronicDisease || "-"}
              onChange={handleChange}
              className="bg-white p-2 px-4 rounded-lg w-full"
            />
          ) : (
            <div className="bg-white p-2 px-4 rounded-lg w-auto">
              {formData.chronicDisease || "-"}
            </div>
          )}
        </div>
        
        <div className="mx-2 my-2">
          <div className="text-pri ml-1">Allergic Drugs</div>
          {isEditing ? (
            <input
              type="text"
              name="allergicDrugs"
              value={formData.allergicDrugs || "-"}
              onChange={handleChange}
              className="bg-white p-2 px-4 rounded-lg w-full"
            />
          ) : (
            <div className="bg-white p-2 px-4 rounded-lg w-auto">
              {formData.allergicDrugs || "-"}
            </div>
          )}
        </div>
        
        <div className="mx-2 my-2">
          <div className="text-pri ml-1">Telephone Number</div>
          {isEditing ? (
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              className="bg-white p-2 px-4 rounded-lg w-full"
            />
          ) : (
            <div className="bg-white p-2 px-4 rounded-lg w-auto">
              {formData.phoneNumber || "-"}
            </div>
          )}
        </div>

        <div className="flex flex-row">
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Age</div>
            <div className="bg-white p-2 px-4 rounded-lg w-15">
              {formData.age || "-"}
            </div>
          </div>
          
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Gender</div>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="bg-white p-2 px-4 rounded-lg w-25"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <div className="bg-white p-2 px-4 rounded-lg w-25">
                {formData.gender || "-"}
              </div>
            )}
          </div>
          
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Blood Type</div>
            {isEditing ? (
              <select
                name="bloodType"
                value={formData.bloodType || ""}
                onChange={handleChange}
                className="bg-white p-2 px-4 rounded-lg w-25"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            ) : (
              <div className="bg-white p-2 px-4 rounded-lg w-25">
                {formData.bloodType || "-"}
              </div>
            )}
          </div>
          
          <div className="mx-2 my-2">
            <div className="text-pri ml-1"></div>
            <div className="bg-pri p-1.5 px-5.5 rounded-lg mt-6 border-2 border-pri text-white hover:text-pri hover:bg-white cursor-pointer">
              More...
            </div>
          </div>
        </div>

        <div className="font-bold text-2xl mb-2 mt-10 ml-2">EMERGENCY CONTACT</div>
        
        <div className="mx-2 my-2">
          <div className="text-pri ml-1">Name</div>
          {isEditing ? (
            <input
              type="text"
              name="contactName"
              value={formData.contactName || ""}
              onChange={handleChange}
              className="bg-white p-2 px-4 rounded-lg w-full"
            />
          ) : (
            <div className="bg-white p-2 px-4 rounded-lg w-auto">
              {formData.contactName || "-"}
            </div>
          )}
        </div>
        
        <div className="mx-2 my-2">
          <div className="text-pri ml-1">Relationship</div>
          {isEditing ? (
            <input
              type="text"
              name="relationship"
              value={formData.relationship || ""}
              onChange={handleChange}
              className="bg-white p-2 px-4 rounded-lg w-full"
            />
          ) : (
            <div className="bg-white p-2 px-4 rounded-lg w-auto">
              {formData.relationship || "-"}
            </div>
          )}
        </div>
        
        <div className="mx-2 my-2">
          <div className="text-pri ml-1">Telephone Number</div>
          {isEditing ? (
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone || ""}
              onChange={handleChange}
              className="bg-white p-2 px-4 rounded-lg w-full"
            />
          ) : (
            <div className="bg-white p-2 px-4 rounded-lg w-auto">
              {formData.contactPhone || "-"}
            </div>
          )}
        </div>
        
        <div className="mx-2 my-2">
          <div className="text-pri ml-1">EMAIL</div>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="bg-white p-2 px-4 rounded-lg w-full"
            />
          ) : (
            <div className="bg-white p-2 px-4 rounded-lg w-auto">
              {formData.email || "-"}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Appointment</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this appointment?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;