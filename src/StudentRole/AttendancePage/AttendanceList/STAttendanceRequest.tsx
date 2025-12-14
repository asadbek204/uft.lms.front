import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalContext } from "../../../App.tsx";
import { Langs } from "../../../enums.ts";
import client, { DOMAIN_NAME } from "../../../components/services";

const translations = {
  [Langs.UZ]: {
    title: "Davomatga kirish",
    method1: "1-usul: QR kod orqali",
    scanInfo: "O'qituvchi ko'rsatgan QR kodni telefon kamerasi bilan skaner qiling",
    method2: "2-usul: Telefon yo'q bo'lsa",
    noPhoneLabel: "Kompyuter orqali kirish uchun sababni yozing:",
    placeholder: "Masalan: telefonim uyda qolib ketdi",
    sendRequest: "So'rov yuborish",
    requestSent: "So'rov yuborildi!",
    waitingTeacher: "O'qituvchi tasdiqlashini kuting...",
    or: "yoki",
    accepted: "Qabul qilindi",
  },
  [Langs.RU]: {
    title: "Вход на посещаемость",
    method1: "1 способ: Через QR-код",
    scanInfo: "Отсканируйте QR-код, который показывает учитель, камерой телефона",
    method2: "2 способ: Нет телефона",
    noPhoneLabel: "Напишите причину входа с компьютера:",
    placeholder: "Например: телефон остался дома",
    sendRequest: "Отправить запрос",
    requestSent: "Запрос отправлен!",
    waitingTeacher: "Дождитесь подтверждения учителя...",
    or: "или",
    accepted: "Принято",
  },
  [Langs.EN]: {
    title: "Join Attendance",
    method1: "Method 1: Scan QR Code",
    scanInfo: "Scan the QR code shown by the teacher with your phone camera",
    method2: "Method 2: No phone?",
    noPhoneLabel: "Write the reason for joining from computer:",
    placeholder: "e.g. I left my phone at home",
    sendRequest: "Send Request",
    requestSent: "Request sent!",
    waitingTeacher: "Wait for teacher confirmation...",
    or: "or",
    accepted: "Accepted",
  },
};

const STAttendanceRequest = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useContext(GlobalContext);
  const t = translations[lang];

  const [detail, setDetail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connectWebSocket = (lessonId: number) => {
    const token = localStorage.getItem("token");
    const wsUrl = `wss://${DOMAIN_NAME}/ws/attendance/${lessonId}/${token}/`;
    const socket = new WebSocket(wsUrl);
    setWs(socket);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status) {
        toast.success(t.accepted);
      }
    };
  }

  useEffect(() => {
    (async() => {
      try {
        const res = await client.get(`education/todays-lesson/${id}/`);
        connectWebSocket(res.data.id);
      } catch (err: any) {
        toast.error(err.response?.data?.detail);
      }
    })()
    return () => {
      ws?.close();
    };
  }, [ws]);

  const sendRequest = () => {
    if (!detail.trim()) {
      toast.error(
        lang === Langs.UZ
          ? "Sababni kiriting!"
          : lang === Langs.RU
          ? "Укажите причину!"
          : "Please enter a reason!"
      );
      return;
    }
    ws?.send(JSON.stringify({"status": false, "detail": detail}));
    setIsSent(true);
    toast.success(t.requestSent);
  };

  return (
    <div className="w-full 2xl:h-[100%]  h-[96%] overflow-y-auto ">
      <div className="min-h-full py-6 px-4">
        <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="w-12 h-12 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-md transition flex items-center justify-center"
          >
            <i className="fa-solid fa-arrow-left text-gray-700 dark:text-gray-300"></i>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white">
            {t.title}
          </h1>
          <div className="w-12"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center transform hover:scale-[1.02] transition-transform duration-300">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                {t.method1}
              </div>

              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-4 border-dashed border-gray-400 dark:border-gray-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <i className="fa-solid fa-qrcode text-8xl text-gray-500 dark:text-gray-400 animate-pulse"></i>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {t.scanInfo}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6 text-center">
                {t.method2}
              </div>

              {isSent ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <i className="fa-solid fa-check text-5xl text-green-600 dark:text-green-400"></i>
                  </div>
                  <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-3">
                    {t.requestSent}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {t.waitingTeacher}
                  </p>
                  <div className="mt-6 flex justify-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-3 text-lg">
                      {t.noPhoneLabel}
                    </label>

                    <textarea
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      placeholder={t.placeholder}
                      rows={5}
                      className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white resize-none transition-all"
                    />
                  </div>

                  <button
                    onClick={sendRequest}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                    {t.sendRequest}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-center py-4">
            <span className="inline-block px-8 py-3 bg-white dark:bg-gray-800 rounded-full text-lg font-medium text-gray-700 dark:text-gray-300 shadow-md">
              {t.or}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STAttendanceRequest;