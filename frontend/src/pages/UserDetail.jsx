import { Link } from "react-router-dom";

const UserDetail = () => {
  return (
    // big page that contains two parts 
    <div className="m-30">
      {/* left part */}
      <div>
        {/* user part - not sure how to make*/}
        <div>
          <img src="" alt="My profile image" />
          <h1>UserId</h1>
          <p>ID:</p>
        </div>
        {/* Appointment reminder - card*/}
        <div>
          <div>Appointment Reminder</div>
          <div>
            <img src="" alt="Doctor image" />
            <p>Mr.Good doctor</p>
            <p>Date:</p>
            <p>Time:</p>
            <p>Place:</p>
            <p>3 days left</p>
            <button>More Details</button>
          </div>
        </div>
      </div>
      {/* right part */}
      <div>
        {/* patient information */}
        <div className="">
          <h1>PATIENT INFORMATION</h1>
          <input type="text" placeholder="name" className=""/>
          <input type="text" placeholder="surname"/>
          <input type="text" placeholder="birth date"/>
          <input type="text" placeholder="age"/>
          <input type="text" placeholder="gender"/>
          <input type="text" placeholder="chronic disease"/>
          <input type="text" placeholder="blood type"/>
          <input type="text" placeholder="allergic drugs"/>
          <input type="text" placeholder="telephone number"/>
        </div>
        <div>
          <h1>EMERGENCY CONTACT</h1>
          <input type="text" placeholder="Name"/>
          <input type="text" placeholder="Relationship"/>
          <input type="text" placeholder="Phone number"/>
          <input type="email" placeholder="Email"/>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;