import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import 'dayjs/locale/uz';
import { Langs } from "../../../enums.ts";
import { GlobalContext } from '../../../App.tsx';
import client from '../../../components/services';
import Loading from '../../../components/LoadingComponent/Loading.tsx';

dayjs.locale('uz');

// Backenddan kelgan javob strukturasiga mos interface
interface AttendanceResponse {
  id: number;
  date: string;
  status: boolean;
  score: number;
  lesson: {
    id: number;
    date: string;
    unit?: string;
    status: string;
    // boshqa kerakli fieldlar...
  };
  student: {
    id: number;
    user: {
      first_name: string;
      last_name?: string;
    };
  };
}

interface AttendanceRecord {
  date: string;
  status: boolean;
  score: number;
}

type TGroupsComponentContent = {
  title: string;
  data: string;
  status: string;
  score: string;        // Yangi qo'shildi
  present: string;      // Yangi
  absent: string;       // Yangi
  attandance: string;
};

const contentsMap = new Map<Langs, TGroupsComponentContent>([
  [
    Langs.UZ,
    {
      title: "Sizning davomatingiz",
      attandance: "Bugungi dars",
      data: "Sana",
      status: "Holati",
      score: "Baho",
      present: "Keldi",
      absent: "Kelmadi",
    },
  ],
  [
    Langs.RU,
    {
      title: "Ваша посещаемость",
      attandance: "Сегодняшний урок",
      data: "Дата",
      status: "Статус",
      score: "Оценка",
      present: "Присутствовал",
      absent: "Отсутствовал",
    },
  ],
  [
    Langs.EN,
    {
      title: "Your attendance",
      attandance: "Today's Lesson",
      data: "Date",
      status: "Status",
      score: "Score",
      present: "Present",
      absent: "Absent",
    },
  ],
]);

const STAttendanceList: React.FC = () => {
  const { lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TGroupsComponentContent;

  const { id } = useParams<{ id: string }>();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // API: education/my_attendance/{group_id} yoki {student_id} — sizning holatingizda group id
        const response = await client.get<AttendanceResponse[]>(`education/my_attendance/${id}`);

        // Kelgan ma'lumotdan kerakli qismlarni ajratib olamiz
        const formattedData: AttendanceRecord[] = response.data.map((record) => ({
          date: record.date,
          status: record.status,
          score: record.score ?? 0, // Agar score null bo'lsa 0 qo'yamiz
        }));

        // Sana bo'yicha teskari tartibda (eng yangi birinchi)
        formattedData.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());

        setAttendanceData(formattedData);
      } catch (err) {
        console.error('Failed to fetch attendance data:', err);
        setError(err as Error);
        toast.error("Davomat ma'lumotlarini yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [id]);

  return (
    <div className="mt-12 px-4 md:mt-0 bg-center-center bg-full block w-full max-h-[850px] rounded drop-shadow-xl overflow-y-auto">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => window.history.back()}
          className="w-12 h-12 mx-3 my-3 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
        >
          <i className="fa-solid fa-arrow-left text-black"></i>
        </button>
        <h1 className="text-xl md:text-4xl font-bold dark:text-white">
          {contents.title}
        </h1>
        <Link to={`/topics-attandance/${id}`}>
          <button className="!p-3 bg-blue-400 text-white hover:bg-blue-500 rounded font-medium">
            {contents.attandance}
          </button>
        </Link>
      </div>

      <div className="w-full md:max-w-4xl max-w-xs mt-8 mx-auto">
        {loading && (
          <div className="text-center text-xl dark:text-white py-10">
            <Loading />
          </div>
        )}

        {error && (
          <div className="text-center text-xl text-red-500 py-10">
            Xatolik: {error.message}
          </div>
        )}

        {!loading && !error && attendanceData.length === 0 && (
          <div className="text-center text-xl text-gray-500 py-10">
            Davomat ma'lumotlari mavjud emas
          </div>
        )}

        {!loading && !error && attendanceData.length > 0 && (
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {contents.data}
                </th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {contents.status}
                </th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {contents.score}
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-700/50"
                      : "bg-white dark:bg-gray-800"
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  {/* Sana */}
                  <td className="py-4 px-6 text-gray-900 dark:text-gray-300 font-medium">
                    {dayjs(record.date).format("DD.MM.YYYY")}
                  </td>

                  {/* Status: keldi / kelmadi */}
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                        record.status
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          record.status ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      {record.status ? contents.present : contents.absent}
                    </span>
                  </td>

                  {/* Baho (score) */}
                  <td className="py-4 px-6 text-center text-lg font-bold text-gray-900 dark:text-white">
                    {record.status ? record.score : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default STAttendanceList;