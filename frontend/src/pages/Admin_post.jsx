import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';
import { Axios } from "../utils/axiosInstance";
import { createEventAPI } from "../api/getEvents";

function Popup({ isOpen, onClose, title, children }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className="fixed inset-0 bg-black opacity-75" 
        onClick={onClose}
      />
      
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 z-10 ${isOpen ? 'scale-100' : 'scale-95'}`}>
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
          </button>
        </div>
        
        <div className="p-4">
          {children}
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
        
      </div>
    </div>
  );
}

const Admin_post = () => {
  const [formData, setFormData] = useState({
    name: '',
    eventDates: '',
    day: '0',
    month: 'Month',
    place: '',
    website: '',
    organizer: '',
    phone: '',
    email: '',
    linkedin: '',
    description: '',
    sendNotification: false
  });
  
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Events, setEvents] = useState([]);
  const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false });

  const fetchEventData = async () => {
    try {
      const response = await createEventAPI();
      if (response.data.success) {
        setEvents(response.data.data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (e) {
      console.error("Error fetching events:", e);
    } finally {
      // setLoading(false);
    }
  };
    
  useEffect(() => {
    fetchEventData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setImageFile(file); 
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ message: '', isError: false });
    
    try {
      const eventData = new FormData();
      for (const key in formData) {
        eventData.append(key, formData[key]);
      }
      
      if (imageFile) {
        eventData.append('image', imageFile);
      }
      
      const response = await Axios.post('/api/events/create', eventData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setFormData({
          name: '',
          eventDates: '',
          day: '0',
          month: 'Month',
          place: '',
          website: '',
          organizer: '',
          phone: '',
          email: '',
          linkedin: '',
          description: '',
          sendNotification: false
        });
        setImage(null);
        setImageFile(null);
        
        setSubmitStatus({ 
          message: 'Event created successfully!', 
          isError: false 
        });
        
        fetchEventData();
      } else {
        setSubmitStatus({ 
          message: response.data.message || 'Failed to create event', 
          isError: true 
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setSubmitStatus({ 
        message: error.response?.data?.message || 'Error creating event', 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-col gap-1.5 items-start justify-center p-4 mx-auto">
      <div className="bg-light-blue p-4 mx-auto max-w-90 flex flex-col min-h-full">
        <h2 className="font-bold text-pri">Event post</h2>
        <div className="my-2 bg-gray-200 border border-gray-300 rounded-lg overflow-hidden max-w-screen h-60">
          {image ? (
            <div className="w-full flex flex-col items-center">
              <div className="rounded-lg overflow-hidden max-w-120">
                <img 
                  src={image} 
                  alt="Uploaded" 
                  className="w-auto h-60 object-cover"
                />
              </div>
            </div>
          ) : (
            <p className="text-center mt-27">No image</p>
          )}
        </div>
        <button 
          onClick={() => setShowPopup(true)}
          className="bg-pri py-3 mt-1.5 text-white rounded-lg max-w-82 w-screen hover:bg-blue-800 duration-300"
        >
          Upload Image
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-light-blue p-4 max-w-90 mx-auto ">
        {submitStatus.message && (
          <div className={`p-2 mb-4 rounded ${submitStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {submitStatus.message}
          </div>
        )}
        
        <div className="">
          <div className="text-pri ml-1">Title of event</div>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Type Event Name"
            className="bg-white p-2 px-4 rounded-lg w-82 text-sm outline-0" 
            required
          />
        </div>

        {/* day month */}
        <div className="mt-2 flex gap-2">
          <div>
            <label className="text-pri ml-1">Day</label>
            <input 
              type="number" 
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              placeholder="Type day"
              className="bg-white p-2 px-4 rounded-lg w-40 text-sm outline-0" 
              required
            />
          </div>
          
          <div>
            <label className="text-pri ml-1">Month</label>
            <input 
              type="text" 
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              placeholder="Type Month"
              className="bg-white p-2 px-4 rounded-lg w-40 text-sm outline-0" 
              required
            />
          </div>
        </div>
        
        <div className="mt-2">
          <div className="text-pri ml-1">Event Dates</div>
          <input 
            type="text" 
            name="eventDates"
            value={formData.eventDates}
            onChange={handleInputChange}
            placeholder="e.g., May 20-25, 2025"
            className="bg-white p-2 px-4 rounded-lg w-82 text-sm outline-0" 
            required
          />
        </div>

        <div className="mt-2">
          <div className="text-pri ml-1">Location</div>
          <input 
            type="text" 
            name="place"
            value={formData.place}
            onChange={handleInputChange}
            placeholder="Event location"
            className="bg-white p-2 px-4 rounded-lg w-82 text-sm outline-0" 
            required
          />
        </div>

        <div className="mt-2">
          <div className="text-pri ml-1">Website (optional)</div>
          <input 
            type="url" 
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://example.com"
            className="bg-white p-2 px-4 rounded-lg w-82 text-sm outline-0" 
          />
        </div>

        <div className="mt-2">
          <div className="text-pri ml-1">Organizer</div>
          <input 
            type="text" 
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            placeholder="Organizing company/person"
            className="bg-white p-2 px-4 rounded-lg w-82 text-sm outline-0" 
            required
          />
        </div>

        <div className="mt-2 flex gap-2">
          <div>
            <label className="text-pri ml-1">Phone</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Contact phone"
              className="bg-white p-2 px-4 rounded-lg w-40 text-sm outline-0" 
              required
            />
          </div>
          
          <div>
            <label className="text-pri ml-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Contact email"
              className="bg-white p-2 px-4 rounded-lg w-40 text-sm outline-0" 
              required
            />
          </div>
        </div>

        <div className="mt-2">
          <div className="text-pri ml-1">LinkedIn (optional)</div>
          <input 
            type="url" 
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/..."
            className="bg-white p-2 px-4 rounded-lg w-82 text-sm outline-0" 
          />
        </div>
        
        <div className="mt-2">
          <div className="text-pri ml-1">Event Description</div> 
          <textarea 
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="bg-white p-2 px-4 rounded-lg w-82 text-sm outline-0"  
            placeholder="Type Event description"
            required
          ></textarea>
        </div>
        
        <div>
          <input 
            type="checkbox" 
            name="sendNotification"
            checked={formData.sendNotification}
            onChange={handleInputChange}
            className="mx mt-5 rounded-full"
          />
          <span className="text-sm ml-2">Send Notification to User Email</span>
        </div>
        
        <button 
          type="submit" 
          className="py-2.5 px-4 max-w-82 w-screen mt-2 bg-pri text-lg border-pri border-1 text-white rounded-lg hover:bg-white hover:text-pri duration-300"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send to User"}
        </button>
      </form>
      
      <Popup 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)}
        title="Upload Event Picture"
      >
        <div className="flex flex-col justify-center">
          <div className="mb-6 w-auto">
            <label className="flex flex-col items-center px-4 py-6 bg-gradient-to-br from-white to-white text-blue-500 rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:from-cyan-300 hover:to-indigo-700 hover:text-white duration-300">
              <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-base leading-normal">Select an image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            <p className="mt-2">Upload Image</p>
            <div className="max-w-screen flex flex-col items-center mt-2 border border-gray-300 rounded-lg overflow-hidden h-60">
              {image && (
                <img 
                  src={image} 
                  alt="Uploaded" 
                  className="w-auto h-60 object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default Admin_post;