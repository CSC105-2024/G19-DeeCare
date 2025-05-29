// UserDetail.jsx - Fixed version with proper data structure handling
import {useState, useEffect} from "react";
import {Axios} from "../utils/axiosInstance.js";
import {useNavigate} from "react-router-dom";

const UserDetail = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        bloodType: "",
        chronicDiseases: "",
        allergies: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
        profileImage: ""
    });

    // Check authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/');
            return;
        }

        fetchUserProfile();
        fetchUserAppointments();
    }, [navigate]);

    // Listen for logout events
    useEffect(() => {
        const handleLogout = () => {
            navigate('/');
        };

        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, [navigate]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching user profile...');

            const response = await Axios.get('/auth/profile');
            console.log('Profile response:', response.data);

            // Fix: Handle both possible response structures
            let userData;
            if (response.data && response.data.success && response.data.data) {
                // Backend returns: { success: true, data: user }
                userData = response.data.data;
            } else if (response.data && response.data.user) {
                // Fallback: { user: userData }
                userData = response.data.user;
            } else {
                console.error('Unexpected profile response structure:', response.data);
                setError('Invalid profile data received');
                return;
            }

            console.log('User data:', userData);

            setFormData({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                phoneNumber: userData.phoneNumber || "",
                dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : "",
                gender: userData.gender || "",
                bloodType: userData.bloodType || "",
                chronicDiseases: userData.chronicDiseases || "",
                allergies: userData.allergies || "",
                emergencyContactName: userData.emergencyContactName || "",
                emergencyContactPhone: userData.emergencyContactPhone || "",
                emergencyContactRelationship: userData.emergencyContactRelationship || "",
                profileImage: userData.profileImage || ""
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError('Failed to load user profile: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchUserAppointments = async () => {
        try {
            console.log('Fetching user appointments...');
            const response = await Axios.get('/appointments/user');
            console.log('Appointments response:', response.data);

            // Fix: Handle the correct response structure
            let appointmentsData = [];
            if (response.data && response.data.appointments) {
                appointmentsData = response.data.appointments;
            } else if (Array.isArray(response.data)) {
                appointmentsData = response.data;
            }

            console.log('Appointments data:', appointmentsData);

            if (appointmentsData.length > 0) {
                // Transform appointments to match the expected format
                const transformedAppointments = appointmentsData.map(apt => {
                    console.log('Processing appointment:', apt);

                    return {
                        id: apt.id,
                        doctorName: apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : 'Unknown Doctor',
                        doctorImage: apt.doctor?.profileImage || "/images/default-doctor.jpg",
                        date: new Date(apt.appointmentDate || apt.date).toLocaleDateString(),
                        time: apt.appointmentTime || apt.time || 'Time not set',
                        location: apt.location || "Hospital",
                        status: apt.status || 'pending',
                        daysLeft: Math.ceil((new Date(apt.appointmentDate || apt.date) - new Date()) / (1000 * 60 * 60 * 24))
                    };
                });

                console.log('Transformed appointments:', transformedAppointments);
                setAppointments(transformedAppointments);
            } else {
                console.log('No appointments found');
                setAppointments([]);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            // Don't show error for appointments as it's not critical, but log it
            console.log('Setting empty appointments array due to error');
            setAppointments([]);
        }
    };

    const getUserInitials = () => {
        const firstInitial = formData.firstName ? formData.firstName.charAt(0).toUpperCase() : "";
        const lastInitial = formData.lastName ? formData.lastName.charAt(0).toUpperCase() : "";
        return firstInitial + lastInitial || "U";
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            console.log('Saving profile data:', formData);

            // Update basic profile
            const profileResponse = await Axios.put('/auth/profile', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                bloodType: formData.bloodType,
                chronicDiseases: formData.chronicDiseases,
                allergies: formData.allergies,
                profileImage: formData.profileImage
            });

            console.log('Profile update response:', profileResponse.data);

            // Update emergency contact separately
            const emergencyResponse = await Axios.put('/auth/emergency-contact', {
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone,
                emergencyContactRelationship: formData.emergencyContactRelationship
            });

            console.log('Emergency contact update response:', emergencyResponse.data);

            // Update localStorage user data
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = {...currentUser, ...formData};
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            setError(error.response?.data?.message || error.response?.data?.error || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (appointmentId) => {
        setAppointmentToDelete(appointmentId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            console.log('Deleting appointment:', appointmentToDelete);
            await Axios.delete(`/appointments/${appointmentToDelete}`);

            // Remove from local state
            const updatedAppointments = appointments.filter(
                appointment => appointment.id !== appointmentToDelete
            );
            setAppointments(updatedAppointments);

            setShowDeleteConfirm(false);
            setAppointmentToDelete(null);
            alert('Appointment deleted successfully!');
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Failed to delete appointment: ' + (error.response?.data?.error || error.message));
            setShowDeleteConfirm(false);
            setAppointmentToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setAppointmentToDelete(null);
    };

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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row justify-center items-center">
            {error && (
                <div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-2 text-white hover:text-gray-200"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* profile and appointment reminder */}
            <div>
                <div
                    className="bg-gradient-to-b from-cyan-400 to-blue-600 m-5 p-1 w-116 rounded-xl hover:from-blue-500 hover:to-violet-600 hover:shadow-indigo-700/30 hover:shadow-lg ">
                    <div className="bg-white w-114 flex items-center p-6 transition rounded-lg">
                        {formData.profileImage ? (
                            <img
                                src={formData.profileImage}
                                className="w-24 h-24 bg-gray-200 rounded-full object-cover"
                                alt="User profile"
                            />
                        ) : (
                            <div
                                className="w-24 h-24 p-10 bg-pri rounded-full flex items-center justify-center text-white text-3xl font-medium">
                                {getUserInitials()}
                            </div>
                        )}
                        <div className="ml-5 flex-grow">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {formData.firstName} {formData.lastName}
                            </h2>
                            <p className="text-gray-600">Email: {formData.email}</p>
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
                                    className="cursor-pointer px-3 py-1 rounded-lg w-full"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="icon icon-tabler icons-tabler-outline icon-tabler-camera-up text-pri"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path
                                            d="M12 20h-7a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5"/>
                                        <path d="M12 16a3 3 0 1 0 0 -6a3 3 0 0 0 0 6z"/>
                                        <path d="M19 22v-6"/>
                                        <path d="M22 19l-3 -3l-3 3"/>
                                    </svg>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                <div className="m-5 w-116 max-h-75 overflow-auto rounded-2xl">
                    <div className="bg-pri py-2 pl-4 text-white font-medium text-xl">Appointment Reminder</div>
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
                                                    onError={(e) => {
                                                        e.target.src = '/images/default-doctor.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="ml-3 flex-grow">
                                                <h2 className="text-lg font-semibold text-gray-800">{appointment.doctorName}</h2>
                                                <p className="text-gray-600 text-xs">Date : {appointment.date}</p>
                                                <p className="text-gray-600 text-xs">Time : {appointment.time}</p>
                                                <p className="text-gray-600 text-xs">At {appointment.location}</p>
                                                <p className={`text-sm font-medium ${
                                                    appointment.status === 'confirmed' ? 'text-green-600' :
                                                        appointment.status === 'pending' ? 'text-yellow-600' :
                                                            appointment.status === 'cancelled' ? 'text-red-600' :
                                                                'text-gray-600'
                                                }`}>
                                                    Status: {appointment.status}
                                                </p>
                                                {appointment.daysLeft > 0 && (
                                                    <p className="text-red-600">{appointment.daysLeft} days left</p>
                                                )}
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => handleDeleteClick(appointment.id)}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                         viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd"
                                                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="w-auto mx-2 py-2 bg-gradient-to-tr from-pri to-blue-400 text-white text-center rounded-lg hover:bg-gradient-to-bl transition font-semibold cursor-pointer">
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
                    <div className="font-bold text-2xl mt-1 ml-2">Patient Information</div>
                    <div
                        onClick={() => {
                            if (isEditing) {
                                handleSave();
                            } else {
                                setIsEditing(true);
                            }
                        }}
                        className={`text-xl w-17 text-center py-1 ml-25 rounded-lg border-2 cursor-pointer transition-all ${
                            saving
                                ? 'bg-gray-400 border-gray-400 text-white cursor-not-allowed'
                                : 'bg-pri border-pri text-white hover:text-pri hover:bg-white'
                        }`}
                    >
                        {saving ? "Saving..." : isEditing ? "Save" : "Edit"}
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
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ""}
                            onChange={handleChange}
                            className="bg-white p-2 px-4 rounded-lg w-full"
                        />
                    ) : (
                        <div className="bg-white p-2 px-4 rounded-lg w-auto">
                            {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : "-"}
                        </div>
                    )}
                </div>

                <div className="mx-2 my-2">
                    <div className="text-pri ml-1">Chronic Disease</div>
                    {isEditing ? (
                        <input
                            type="text"
                            name="chronicDiseases"
                            value={formData.chronicDiseases || ""}
                            onChange={handleChange}
                            className="bg-white p-2 px-4 rounded-lg w-full"
                            placeholder="Enter chronic diseases or conditions"
                        />
                    ) : (
                        <div className="bg-white p-2 px-4 rounded-lg w-auto">
                            {formData.chronicDiseases || "-"}
                        </div>
                    )}
                </div>

                <div className="mx-2 my-2">
                    <div className="text-pri ml-1">Allergies</div>
                    {isEditing ? (
                        <input
                            type="text"
                            name="allergies"
                            value={formData.allergies || ""}
                            onChange={handleChange}
                            className="bg-white p-2 px-4 rounded-lg w-full"
                            placeholder="Enter allergies or allergic reactions"
                        />
                    ) : (
                        <div className="bg-white p-2 px-4 rounded-lg w-auto">
                            {formData.allergies || "-"}
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
                        <div className="text-pri ml-1">Gender</div>
                        {isEditing ? (
                            <select
                                name="gender"
                                value={formData.gender || ""}
                                onChange={handleChange}
                                className="bg-white p-2 px-4 rounded-lg w-25"
                            >
                                <option value="">Select</option>
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
                </div>

                <div className="font-bold text-2xl mb-2 mt-10 ml-2">EMERGENCY CONTACT</div>

                <div className="mx-2 my-2">
                    <div className="text-pri ml-1">Name</div>
                    {isEditing ? (
                        <input
                            type="text"
                            name="emergencyContactName"
                            value={formData.emergencyContactName || ""}
                            onChange={handleChange}
                            className="bg-white p-2 px-4 rounded-lg w-full"
                        />
                    ) : (
                        <div className="bg-white p-2 px-4 rounded-lg w-auto">
                            {formData.emergencyContactName || "-"}
                        </div>
                    )}
                </div>

                <div className="mx-2 my-2">
                    <div className="text-pri ml-1">Relationship</div>
                    {isEditing ? (
                        <input
                            type="text"
                            name="emergencyContactRelationship"
                            value={formData.emergencyContactRelationship || ""}
                            onChange={handleChange}
                            className="bg-white p-2 px-4 rounded-lg w-full"
                        />
                    ) : (
                        <div className="bg-white p-2 px-4 rounded-lg w-auto">
                            {formData.emergencyContactRelationship || "-"}
                        </div>
                    )}
                </div>

                <div className="mx-2 my-2">
                    <div className="text-pri ml-1">Telephone Number</div>
                    {isEditing ? (
                        <input
                            type="tel"
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone || ""}
                            onChange={handleChange}
                            className="bg-white p-2 px-4 rounded-lg w-full"
                        />
                    ) : (
                        <div className="bg-white p-2 px-4 rounded-lg w-auto">
                            {formData.emergencyContactPhone || "-"}
                        </div>
                    )}
                </div>

                <div className="mx-2 my-2">
                    <div className="text-pri ml-1">EMAIL</div>
                    <div className="bg-gray-100 p-2 px-4 rounded-lg w-auto text-gray-600">
                        {formData.email || "-"} (Cannot be changed)
                    </div>
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