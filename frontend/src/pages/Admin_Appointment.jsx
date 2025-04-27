import { Link } from "react-router-dom";

const Admin_Appointment = () => {
  return (
    <form action="/Admin_post" className="justify-center flex flex-col lg:flex-row max-w-screen ">
      <div className="justify-center">
        <h2 className="px-5 mt-5 text-2xl text-blue-950">Doctor Information</h2>
        <div className="bg-light-blue p-5 w-auto h-110 mx-2 rounded-2xl ">
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Doctor ID</div>
            <input type="text"
            placeholder="Type Doctor id"
            maxLength={13} 
            className="bg-white p-2 px-4 rounded-lg w-80 outline-0" 
            pattern="[0-9]{13}"
            title="13 numbers of ID"/>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Department</div>
            <input type="Text" placeholder="Type Department"
            className="bg-white p-2 px-4 rounded-lg w-80  outline-0" />
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Meeting Place</div> 
            <textarea rows={2}className="bg-white p-2 px-4 rounded-lg w-80  outline-0"  
            placeholder="Type Address of Appointment place" name="address"></textarea>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Appoinment Details</div>
            <textarea rows={4}className="bg-white p-2 px-4 rounded-lg w-80  outline-0"  
            placeholder="Type Details" name="address"></textarea>
          </div>
        </div>
      </div>

      <div>
        <h2 className="px-7 mt-5 text-2xl text-blue-950">User Information</h2>
        <div className="bg-light-blue p-5 w-auto h-110 mx-2 mb-5 rounded-2xl ">
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">User ID</div>
            <input type="text" placeholder="Type User id"
            maxLength={13}
            pattern="[0-9]{13}"
            title="13 numbers of ID"
            className="bg-white p-2 px-4 rounded-lg w-80  outline-0" />
          </div>
          <div className="flex flex-row">
            <div className="mx-2 my-2">
              <div className="text-pri ml-1">Date</div>
              <input type="Date" placeholder="MM/DD/YYYY"
              className="bg-white p-2 px-4 rounded-lg w-42  outline-0" />
            </div>
            <div className="mx-2 my-2">
              <div className="text-pri ml-1">Time</div>
              <input type="Time" placeholder="MM/DD/YYYY"
              className="bg-white p-2 px-4 rounded-lg w-34  outline-0" />
            </div>
          </div>
          <div className="mx-2 my-2">
            <div className="text-pri ml-1">Notification Messaages</div> 
            <textarea rows={3}className="bg-white p-2 px-4 rounded-lg w-80 outline-0"  
            placeholder="Type Address of Appointment place" name="address"></textarea>
          </div>
          <div>
            <input type="checkbox" className="mx-3 rounded-full"/>
            <text>Send Notification to User Email</text>
          </div>
          <div>
            <button type="submit" value="Submit"
            
            className="py-2 px-4 m-2 mt-7 bg-pri text-lg border-pri border-1 text-white rounded-xl
            hover:bg-white hover:text-pri duration-300 "
            >Send to User</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Admin_Appointment;
