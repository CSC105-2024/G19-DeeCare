import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [complete,setComplete] = useState(true)
  
  const Todo = [
    {
      id: 1,
      name: "sleep",
      success: true,
    },
    {
      id: 2,
      name: "bruhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhharttttttt",
      success: false,
    },
    {
      id: 3,
      name: "campus",
      success: true,
    },
    {
      id: 4,
      name: "doctor appointment to home",
      success: false,
    },
    {
      id: 5,
      name: "egg",
      success: false,
    }
  ];

  const check = (su) =>{
    if(su === complete){
      
    }
  }

  return (
    <div className=" bg-gray-100">
      <div className="bg-black text-2xl text-white  px-5 py-2  ">Todo List?    bruh...</div>
      <div className='flex flex-col justify-center object-center'>
      {/* add todo */}
    
      <div className='flex flex-row justify-center '>
        <div className='border-2 p-3 w-100 mt-10 rounded-lg shadow-xl '>
          <div className='flex flex-col'>
          <input type='text' 
          placeholder='title of todo'
          className='outline-0 pl-2 text-lg text-black font-bold'/>
          </div>
        </div>
        <button className='p-3 border-2 border-green-600 mt-10 items-center rounded-lg ml-5 w-15
        hover:bg-green-600 hover:text-white text-green-600 font-bold duration-300'>Add</button>
      </div>
      {/* show todo */}
      <div className="space-y-4 p-5 bg-gray-400 mt-5 rounded-lg w-120 max-h-100 overflow-y-scroll mx-auto">
        {Todo.map((todo) => (
        <div className="flex flex-row justify-between bg-white p-3 rounded-lg">
          <div className='flex flex-row'>
          <div className={`${todo.success ? 'bg-green-400 rounded-full w-10 h-10 my-auto'
           : 'bg-red-400  rounded-full w-10 h-10 my-auto'}`}
              
          ></div> 
          <div className='break-words max-w-xs w-61 p-1.5    px-3 '>{todo.name}</div>
          </div>
          <div>
          <button 
            className="bg-gray-700 mt-1 w-15 py-1 ml-2 text-white font-bold text-center rounded-lg
            hover:text-white hover:bg-gray-500 duration-300 transition"> 
            Edit 
          </button>
          <button 
            className="bg-red-700 mt-1 w-10 py-1 ml-2 text-white font-bold text-center rounded-lg
            hover:text-white hover:bg-red-500 duration-300 transition"> 
            X 
          </button>
          </div>
        </div>
        ))}
        
      </div>
      </div>
      
    </div>
  )
}

export default App
