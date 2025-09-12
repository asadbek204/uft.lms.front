// import { useEffect } from "react";
// import client from "../../../../components/services";
// import { useParams } from 'react-router-dom';

const TCHTopicsAttendance = () => {
  // const { id } = useParams<{ id: string}>();


  // useEffect(() => {
  //   (async () => {
  //     const todaysLesson = await client.get(`education/todays-lesson/${id}`)
  //   })()
  // }, [])

  return (
    <div className="p-5 w-full h-[90vh]">
    
      <button
        onClick={() => window.history.back()}
        className="w-12 h-12 my-3 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center shadow-md"
        aria-label="Go back"
      >
        <i className="fa-solid fa-arrow-left text-black"></i>
      </button>

 
      <h1 className="text-2xl font-semibold text-center mb-5">TCH Topics Attendance</h1>

  
      <div className="flex justify-center items-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
          alt="QR Code"
          className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>
    </div>
  );
};

export default TCHTopicsAttendance;
