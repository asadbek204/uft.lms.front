import React, { useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";

type AttendanceRecord = {
  id: number;
  student: { id: number };
  lesson: { id: number };
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
      toast.error("Bu kunga dars mavjud emas!");
      return;
    }

    const record = attendanceData.find(
      (r) =>
        r.student.id === student.id &&
        r.lesson.id === lesson.id
    );

    console.log("🔍 Found record:", record);

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

    if (!lesson) {
      toast.error("Dars topilmadi!");
      return;
    }

    const finalScore = status ? Number(scoreInput) || 0 : 0;


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
      <div className="overflow-x-auto  bg-white rounded-lg shadow-lg mt-6">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="sticky left-0 z-10 bg-white py-4 px-6 text-left font-bold text-gray-700">
                {tableHeading}
              </th>
              {dates.map((date) => (
                <th key={date.format("DD")} className="py-4 px-3 text-center font-medium text-gray-600">
                  {date.format("DD")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-t hover:bg-gray-50 transition">
                <td className="sticky left-0 z-10 bg-white py-4 px-6 font-medium">
                  {student.user.first_name} {student.user.last_name}
                </td>

                {dates.map((date) => {
                  const dateStr = date.format("YYYY-MM-DD");
                  const lesson = lessons.find((l) => dayjs(l.date).format("YYYY-MM-DD") === dateStr);

                  const record = attendanceData.find(
                    (r) =>
                      r.student.id === student.id &&
                      r.lesson.id === lesson?.id
                  );

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
                      ) : (
                        <span className="text-gray-300">−</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && selectedStudent && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {selectedStudent.user.first_name} {selectedStudent.user.last_name} <br />
              <span className="text-lg text-gray-600">{selectedDate.format("DD.MM.YYYY")}</span>
            </h3>

            <div className="space-y-8">
              <div>
                <label className="block text-lg font-semibold mb-4">Davomat holati</label>
                <div className="flex justify-center gap-10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status}
                      onChange={() => setStatus(true)}
                      className="w-6 h-6"
                    />
                    <span className="text-2xl text-green-600">Keldi (+)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={!status}
                      onChange={() => setStatus(false)}
                      className="w-6 h-6"
                    />
                    <span className="text-2xl text-red-600">Kelmadi (−)</span>
                  </label>
                </div>
              </div>

              {status && (
                <div>
                  <label className="block text-lg font-semibold mb-3">Baho (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    className="w-full px-5 py-4 border-2 rounded-xl text-2xl text-center"
                  />
                </div>
              )}

              {!status && (
                <div className="text-center py-4">
                  <p className="text-xl font-medium text-red-600">
                    Kelmagan — baho <strong>0</strong>
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-10">
              <button onClick={() => setModalOpen(false)} className="px-8 py-3 bg-gray-300 rounded-xl">
                Bekor qilish
              </button>
              <button onClick={handleSave} className="px-10 py-3 bg-blue-600 text-white rounded-xl">
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}