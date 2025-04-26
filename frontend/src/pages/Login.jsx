// import { Link } from "react-router-dom";
// import LoginOverlay from "../components/LoginOverlay.jsx";
// import React, { useState } from "react";
//
// function Login() {
//     const [showLogin, setShowLogin] = useState(false);
//
//     const handleLogin = (data) => {
//         console.log("Login data:", data);
//         // Handle login logic
//         setShowLogin(false);
//     };
//
//     return (
//         <div
//             className="bg-yellow border-2 border-yellow text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow transition-all"
//         >
//             <button onClick={() => setShowLogin(true)}>Open Login</button>
//             {showLogin && (
//                 <LoginOverlay
//                     onClose={() => setShowLogin(false)}
//                     onLogin={handleLogin}
//                 />
//             )}
//         </div>
//     );
// }
// //
// // const Login = () => {
// //   return (
// //     <>
// //     <div >
// //       <div className="text-4xl">Login page</div>
// //       <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>
// //        <button>
// //         <Link to="/UserDetail">Login</Link>
// //       </button>
// //       </div>
// //       <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>
// //        <button>
// //         <Link to="/Admin_Appointment">Admin Login</Link>
// //       </button>
// //       </div>
// //       <div className='float-left px-4 m-10 rounded-4xl bg-gray-400 text-black'>
// //        <button>
// //         <Link to="/Register">Don't have account yet?</Link>
// //       </button>
// //       </div>
// //       <div className='float-left px-4 m-10 rounded-4xl bg-black text-white'>
// //        <button>
// //         <Link to="/Confirm"> back </Link>
// //       </button>
// //       </div>
// //     </div>
// //     </>
// //   );
// // };
// //
// export default Login;