import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const t = {
  uz: {
    noLesson: "Bu kunga dars mavjud emas!",
    attendanceStatus: "Davomat holati",
    present: "Keldi (+)",
    absent: "Kelmadi (−)",
    scoreLabel: "Baho",
    absentScore: "Kelmagan — baho",
    cancel: "Bekor qilish",
    save: "Saqlash",
  },
  ru: {
    noLesson: "На этот день нет урока!",
    attendanceStatus: "Статус посещаемости",
    present: "Присутствовал (+)",
    absent: "Отсутствовал (−)",
    scoreLabel: "Оценка",
    absentScore: "Отсутствовал — оценка",
    cancel: "Отмена",
    save: "Сохранить",
  },
  en: {
    noLesson: "No lesson on this day!",
    attendanceStatus: "Attendance Status",
    present: "Present (+)",
    absent: "Absent (−)",
    scoreLabel: "Score",
    absentScore: "Absent — score",
    cancel: "Cancel",
    save: "Save",
  },
};

type AttendanceRecord = {
  id: number;
  student: { id: number } | number;
  lesson: { id: number } | number;
  date: string;
  status: boolean;
  score: number | null;
};

type Student = {
  id: number;
  user: { first_name: string; last_name?: string };
};

type Lesson = {
  id: number;
  date: string;
};

type Props = {
  students: Student[];
  attendanceData: AttendanceRecord[];
  lessons: Lesson[];
  currentMonth: dayjs.Dayjs;
  searchTerm: string;
  onSave: (data: {
    id?: number;
    student: number;
    lesson: number;
    date: string;
    status: boolean;
    score: number | null;
  }) => Promise<void>;
  tableHeading: string;
  noStudents: string;
  noStudentsMatch: string;
  lang?: "uz" | "ru" | "en";
};

export default function AttendanceTableBody({
  students,
  attendanceData,
  lessons,
  currentMonth,
  searchTerm,
  onSave,
  tableHeading,
  noStudents,
  noStudentsMatch,
  lang = "uz",
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<boolean>(true);
  const [scoreInput, setScoreInput] = useState<string>("5");

  const daysInMonth = currentMonth.daysInMonth();
  const dates = Array.from({ length: daysInMonth }, (_, i) => currentMonth.date(i + 1));

  const filteredStudents = students.filter((s) => {
    const name = `${s.user.first_name} ${s.user.last_name || ""}`.trim().toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  const openModal = (student: Student, date: dayjs.Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    const lesson = lessons.find((l) => dayjs(l.date).format("YYYY-MM-DD") === dateStr);

    if (!lesson) {
      toast.error(t[lang].noLesson);
      return;
    }

    const record = attendanceData.find((r: any) => {
      const studentId = typeof r.student === "object" ? r.student.id : r.student;
      const lessonId = typeof r.lesson === "object" ? r.lesson.id : r.lesson;
      return studentId === student.id && lessonId === lesson.id;
    });

    setSelectedStudent(student);
    setSelectedDate(date);
    setCurrentRecordId(record?.id);
    setStatus(record?.status ?? true);
    setScoreInput(record?.score?.toString() ?? "5");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedStudent || !selectedDate) return;

    const dateStr = selectedDate.format("YYYY-MM-DD");
    const lesson = lessons.find((l) => dayjs(l.date).format("YYYY-MM-DD") === dateStr);
    if (!lesson) return;

    const finalScore = status ? (Number(scoreInput) || 0) : 0;

    await onSave({
      id: currentRecordId,
      student: selectedStudent.id,
      lesson: lesson.id,
      date: dateStr,
      status,
      score: finalScore,
    });

    setModalOpen(false);
  };

  if (students.length === 0)
    return <div className="text-center py-10 text-gray-600">{noStudents}</div>;
  if (filteredStudents.length === 0)
    return <div className="text-center py-10 text-gray-600">{noStudentsMatch}</div>;

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg mt-6">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="sticky left-0 z-10 bg-white py-4 px-6 text-left font-bold text-gray-800">
                {tableHeading}
              </th>
              {dates.map((date) => (
                <th key={date.format("DD")} className="py-4 px-3 text-center font-medium text-gray-700">
                  {date.format("DD")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-t hover:bg-gray-50 transition">
                <td className="sticky left-0 z-10 bg-white py-4 px-6 font-medium text-gray-800">
                  {student.user.first_name} {student.user.last_name || ""}
                </td>
                {dates.map((date) => {
                  const dateStr = date.format("YYYY-MM-DD");
                  const lesson = lessons.find((l) => dayjs(l.date).format("YYYY-MM-DD") === dateStr);

                  const record = attendanceData.find((r: any) => {
                    const studentId = typeof r.student === "object" ? r.student.id : r.student;
                    const lessonId = typeof r.lesson === "object" ? r.lesson.id : r.lesson;
                    return studentId === student.id && lesson && lessonId === lesson.id;
                  });

                  return (
                    <td
                      key={dateStr}
                      onClick={() => openModal(student, date)}
                      className="text-center py-4 px-3 cursor-pointer text-4xl font-bold hover:bg-blue-50 transition"
                    >
                      {record ? (
                        record.status ? (
                          <span className="text-green-600">+</span>
                        ) : (
                          <span className="text-red-600">−</span>
                        )
                      ) : lesson ? (
                        <span className="text-gray-300">−</span>
                      ) : (
                        <span className="text-gray-200">·</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedStudent && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
              {selectedStudent.user.first_name} {selectedStudent.user.last_name || ""}
            </h3>
            <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">
              {selectedDate.format("DD.MM.YYYY")}
            </p>

            <div className="space-y-8">
              <div>
                <label className="block text-lg font-semibold mb-5 text-center">
                  {t[lang].attendanceStatus}
                </label>
                <div className="flex justify-center gap-12">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status}
                      onChange={() => setStatus(true)}
                      className="w-7 h-7 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-2xl font-medium text-green-600">
                      {t[lang].present}
                    </span>
                  </label>

                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={!status}
                      onChange={() => setStatus(false)}
                      className="w-7 h-7 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-2xl font-medium text-red-600">
                      {t[lang].absent}
                    </span>
                  </label>
                </div>
              </div>

              {status && (
                <div>
                  <label className="block text-lg font-semibold mb-3 text-center">
                    {t[lang].scoreLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    className="w-full px-6 py-5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-3xl text-center font-bold focus:border-blue-500 focus:outline-none transition dark:bg-gray-700"
                    placeholder="5"
                  />
                </div>
              )}

              {!status && (
                <div className="text-center py-6 bg-red-50 dark:bg-red-900/30 rounded-xl">
                  <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                    {t[lang].absentScore} <strong>0</strong>
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-10">
              <button
                onClick={() => setModalOpen(false)}
                className="px-8 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 transition"
              >
                {t[lang].cancel}
              </button>
              <button
                onClick={handleSave}
                className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-lg"
              >
                {t[lang].save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}