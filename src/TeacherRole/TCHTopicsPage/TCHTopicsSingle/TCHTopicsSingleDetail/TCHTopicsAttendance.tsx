import { useEffect, useRef, useState } from "react"
import client, { APIURL } from "../../../../components/services"
import { useParams } from 'react-router-dom'

interface Lesson {
  id: number
  unit: string
}

interface Student {
  student_id: number
  user: {
    id: number,
    first_name: string
    last_name: string
  }
  detail: string
}

const TCHTopicsAttendance = () => {
  const { id } = useParams<{ id: string}>()
  const [lesson, setLesson] = useState<Lesson>({ id: 0, unit: "" })
  const titleInput = useRef<HTMLInputElement>(null)
  const [qrUrl, setQrUrl] = useState<string | undefined>()
  const [ws, setWs] = useState<WebSocket | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (titleInput.current === null) return
    const title = titleInput.current.value
    client.post(`education/todays-lesson/${id}/`, { title }).then(res => {
      setLesson(res.data as Lesson)
      websocketConnect()
    })
  }

  const websocketConnect = () => {
    const wsConnection = new WebSocket(`wss://${APIURL}/ws/attendance/${lesson.id}/${window.localStorage.getItem('token')}/`)
    setWs(wsConnection)
    wsConnection.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.student_id && data.user) {
        showRequest(data as Student)
      }
      else if(data) {
        setQrUrl(data)
      }
    }
  }

  const answerRequest = (student_id: number, status: boolean) => {
    ws?.send(JSON.stringify({ student_id, status }))
  }

  const showRequest = (student: Student) => {
    const accept = window.confirm(`Student: ${student.user.first_name} ${student.user.last_name}\nDetail: ${student.detail}\nDo you want to accept?`)
    answerRequest(student.student_id, accept)
  }

  return (
    <>
    {lesson.id > 0 && qrUrl ?
    (
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
            src={qrUrl}
            alt="QR Code"
            className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>
      </div>) :
     (
      <div>
        <form action="" onSubmit={onSubmit}>
          <input type="text" name="title" ref={titleInput}/>
          <button type="submit">save</button>
        </form>
      </div>
    )
    }
    </>
  );
};

export default TCHTopicsAttendance;
