import './App.css'
import { NavLink, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div >
        <nav className='float text-lg text-white bg-blue-500'>
          <NavLink to="/Home" end >Home</NavLink>
          <NavLink to="/FindDoctor" >Appointment</NavLink>
        </nav>
      </div>
      <Outlet/>
    </>
  )
}

export default App
