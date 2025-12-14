import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import client, { DOMAIN_NAME } from "../../../../components/services";
import { useContext } from "react";
import { GlobalContext } from "../../../../App"; // Langs enum va lang bor joy
import { Langs } from "../../../../enums";

interface Lesson {
  id: number;
  unit: string;
}

interface StudentRequest {
  student_id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  detail: string;
}

const translations = {
  [Langs.UZ]: {
    pageTitle: "Mavzu bo'yicha davomat",
    enterTopic: "Bugungi dars mavzusini kiriting",
    placeholder: "Masalan: Ingliz tili - Present Simple",
    startLesson: "Boshlash",
    loading: "Yuklanmoqda...",
    lessonStarted: "Dars boshlandi!",
    qrActivated: "QR kod faollashtirildi!",
    studentsCanScan: "O'quvchilar telefon orqali QR kodni skan qilib kelishi mumkin",
    lessonId: "Dars ID",
    noPhoneNote: "O'quvchilar telefonida yo'q bo'lsa — ular kompyuter orqali so'rov yuborishi mumkin",
    requestTitle: "Telefon yo'q — kompyuter orqali keldi",
    acceptQuestion: "Ushbu o'quvchini qabul qilasizmi?",
    note: "Izoh",
    reject: "Yo'q",
    accept: "Ha, qabul qilaman",
    accepted: "qabul qilindi!",
    rejected: "rad etildi",
    error: "Xatolik yuz berdi",
    topicRequired: "Mavzuni kiriting!",
    connectionError: "Ulanishda xatolik",
  },
  [Langs.RU]: {
    pageTitle: "Посещаемость по теме",
    enterTopic: "Введите тему сегодняшнего урока",
    placeholder: "Например: Английский язык - Present Simple",
    startLesson: "Начать",
    loading: "Загрузка...",
    lessonStarted: "Урок начат!",
    qrActivated: "QR-код активирован!",
    studentsCanScan: "Студенты могут отсканировать QR-код с телефона",
    lessonId: "ID урока",
    noPhoneNote: "Если у студента нет телефона — он может отправить запрос с компьютера",
    requestTitle: "Нет телефона — зашёл с компьютера",
    acceptQuestion: "Принять этого студента?",
    note: "Примечание",
    reject: "Нет",
    accept: "Да, принять",
    accepted: "принят!",
    rejected: "отклонён",
    error: "Произошла ошибка",
    topicRequired: "Введите тему!",
    connectionError: "Ошибка соединения",
  },
  [Langs.EN]: {
    pageTitle: "Topic-Based Attendance",
    enterTopic: "Enter today's lesson topic",
    placeholder: "e.g. English - Present Simple",
    startLesson: "Start Lesson",
    loading: "Loading...",
    lessonStarted: "Lesson started!",
    qrActivated: "QR code activated!",
    studentsCanScan: "Students can scan QR code with their phone",
    lessonId: "Lesson ID",
    noPhoneNote: "If student has no phone — they can send request from computer",
    requestTitle: "No phone — joined from computer",
    acceptQuestion: "Accept this student?",
    note: "Note",
    reject: "No",
    accept: "Yes, accept",
    accepted: "accepted!",
    rejected: "rejected",
    error: "An error occurred",
    topicRequired: "Please enter topic!",
    connectionError: "Connection error",
  },
};

const TCHTopicsAttendance = () => {
  const { lang } = useContext(GlobalContext);
  const t = translations[lang];

  const { id } = useParams<{ id: string }>();
  const titleInput = useRef<HTMLInputElement>(null);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [pendingRequest, setPendingRequest] = useState<StudentRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWebSocket = (lessonId: number) => {
    const token = localStorage.getItem("token");
    const wsUrl = `wss://${DOMAIN_NAME}/ws/attendance/${lessonId}/${token}/`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      toast.success(t.qrActivated);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.qr_code) {
        setQrUrl(data.qr_code);
      } else if (data.student_id && data.user) {
        setPendingRequest(data as StudentRequest);
      }
    };

    socket.onerror = () => {
      toast.error(t.connectionError);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    setWs(socket);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.current?.value.trim()) {
      toast.error(t.topicRequired);
      return;
    }

    setIsLoading(true);
    try {
      const res = await client.post(`education/todays-lesson/${id}/`, {
        title: titleInput.current.value.trim(),
      });
      setLesson(res.data);
      connectWebSocket(res.data.id);
      toast.success(t.lessonStarted);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const answerRequest = (accepted: boolean) => {
    if (!ws || !pendingRequest) return;

    if (accepted)
      ws.send(
        JSON.stringify({
          student_id: pendingRequest.student_id,
          status: accepted,
        })
      );

    toast.success(
      accepted
        ? `${pendingRequest.user.first_name} ${t.accepted}`
        : `${pendingRequest.user.first_name} ${t.rejected}`
    );

    setPendingRequest(null);
  };

  useEffect(() => {
    return () => {
      ws?.close();
    };
  }, [ws]);

  return (
    <div className="w-full px-4 transition-colors">
      <div className="flex items-center justify-between">
         <button onClick={() => window.history.back()}
                        className='w-12 h-12 my-3 ms-5 bg-gray-200 hover:bg-gray-300 rounded'>
                    <i className='fa-solid fa-arrow-left text-black'></i>
                </button>

        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white ">
          {t.pageTitle}
        </h1>
        <span></span>
      </div>
      <div className="">

        {!lesson ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
              {t.enterTopic}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                ref={titleInput}
                type="text"
                placeholder={t.placeholder}
                className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white transition"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  <i className="fa-solid fa-play"></i>
                )}
                {isLoading ? t.loading : t.startLesson}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 text-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {lesson.unit}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t.studentsCanScan}
              </p>
            </div>

            {qrUrl ? (
              <div className="inline-block p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="w-80 h-80 border-8 border-gray-200 dark:border-gray-700 rounded-2xl"
                />
              </div>
            ) : (
              <div className="w-80 h-80 mx-auto bg-gray-200 dark:bg-gray-700 border-4 border-dashed border-gray-400 dark:border-gray-600 rounded-2xl flex items-center justify-center">
                <i className="fa-solid fa-qrcode text-6xl text-gray-400 dark:text-gray-500"></i>
              </div>
            )}

            <div className="mt-10 text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <p>
                {t.lessonId}: <strong>{lesson.id}</strong>
              </p>
              <p className="text-xs max-w-xl mx-auto">{t.noPhoneNote}</p>
            </div>
          </div>
        )}
      </div>

      {pendingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user-graduate text-4xl text-blue-600 dark:text-blue-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {pendingRequest.user.first_name} {pendingRequest.user.last_name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t.requestTitle}
              </p>
            </div>

            {pendingRequest.detail && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6 text-sm">
                <strong>{t.note}:</strong> {pendingRequest.detail}
              </div>
            )}

            <div className="text-center text-lg font-medium text-gray-700 dark:text-gray-300 mb-8">
              {t.acceptQuestion}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => answerRequest(false)}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition"
              >
                {t.reject}
              </button>
              <button
                onClick={() => answerRequest(true)}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition flex items-center gap-3"
              >
                <i className="fa-solid fa-check"></i>
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TCHTopicsAttendance;