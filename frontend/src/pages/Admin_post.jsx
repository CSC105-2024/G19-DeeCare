import { Link } from "react-router-dom";
import { useState, useRef ,  useEffect } from 'react';


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
            className="text-gray-400 hover:text-gray-500 "
          >
          </button>
        </div>
        
        <div className="p-4">
          {children}
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md 
            hover:bg-gray-300 "
          >
            Cancel
          </button>
          <button 
          onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 "
          >
            Confirm
          </button>
        </div>
        
      </div>
    </div>
  );
}
const Admin_post = () => {
  const [image, setImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-4 mx-auto">
      <div className="bg-light-blue p-4 mx-2 max-w-90">
        <h2 className="font-bold text-pri">Event post</h2>
        <div className=" my-2 bg-gray-200 
          border border-gray-300 rounded-lg overflow-hidden max-w-screen h-60"
          >
        
        {image && (
          <div className="w-full flex flex-col items-center">
            <div className=" rounded-lg overflow-hidden max-w-120">
              <img 
                src={image} 
                alt="Uploaded" 
                className="w-auto h-60  object-cover"
              />
            </div>
          </div>
        )}
        <p className="text-center mt-27 ">No image</p>
        </div>
        <button onClick={() => setShowPopup(true)}
          className="bg-pri py-3 mt-1.5 text-white rounded-lg max-w-82 w-screen 
          hover:bg-blue-800 duration-300 ">
          Upload Image
        </button>
      </div>
      <form action="/Admin_Appointment" className="bg-light-blue p-4 h-91 max-w-90">
        <div className="">
            <div className="text-pri ml-1">Title of event</div>
            <input type="Text" placeholder="Type Event Name"
            className="bg-white p-2 px-4 rounded-lg w-82 text-sm outline-0" />
        </div>
        <div className="mt-2">
            <div className="text-pri ml-1">Event Detail</div> 
            <textarea rows={3}className="bg-white p-2 px-4 rounded-lg w-82 text-sm outline-0"  
            placeholder="Type Event description" name="detail"></textarea>
        </div>
        <div className="flex flex-row">
          <div>
        <div className="text-pri ml-1">Date Start</div>
              <input type="Date" placeholder="MM/DD/YYYY"
              className="bg-white p-2 px-4 rounded-lg w-40 mr-2 text-sm outline-0" /> 
              </div>
        <div>
        <div className="text-pri ml-1">Date End</div>
              <input type="Date" placeholder="MM/DD/YYYY"
              className="bg-white p-2 px-4 rounded-lg w-40 text-sm outline-0" />
        </div>
        </div> 
        <div>
            <input type="checkbox" className="mx mt-5 rounded-full"/>
            <text className="text-sm ml-2 ">Send Notification to User Email</text>
          </div>
            <button type="submit" value="Submit"
            
            className="py-2.5 px-4 max-w-82 w-screen mt-2 bg-pri text-lg border-pri border-1 text-white rounded-lg
            hover:bg-white hover:text-pri duration-300 "
            >Send to User</button>
          
         
      </form>
      
      <Popup 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)}
        title="Upload Event Picture"
      >
        <div className="flex flex-col justify-center">
        <div className=" mb-6 w-auto">
        <label className="flex flex-col items-center px-4 py-6 bg-gradient-to-br from-white to-white text-blue-500 rounded-lg shadow-lg 
        tracking-wide border border-blue-500 cursor-pointer hover:from-cyan-300 hover:to-indigo-700 hover:text-white duration-300">
          <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-base leading-normal">Select an image</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
        <p className="mt-2">Upload Image</p>
        <div className="max-w-screen flex flex-col items-center mt-2
        border border-gray-300 rounded-lg overflow-hidden  h-60"
        >
          
        {image && (
          
            <img 
              src={image} 
              alt="Uploaded" 
              className="w-auto h-60  object-cover"
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