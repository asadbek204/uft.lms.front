import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { Langs } from "../../../enums";
import { GlobalContext } from "../../../App";
import Loading from "../../../components/LoadingComponent/Loading";
import client from "../../../components/services";
import AttendanceHeader from "./TCHAttendanceHeader";
import AttendanceCalendarControls from "./TCHAttendanceCalendarControls";
import AttendanceTableBody from "./TCHAttendanceTableBody";

// To'liq tarjimalar
const contentsMap = {
  [Langs.UZ]: {
    title: "Davomati",
    tableHeading: "O'quvchilar",
    noStudents: "O'quvchilar mavjud emas",
    noStudentsMatch: "Qidiruvga mos talaba topilmadi",
    searchPlaceholder: "Ism bo'yicha qidiruv",
    errorFetchingData: "Ma'lumotlarni olishda xatolik",
    errorUpdatingData: "Davomatni saqlashda xatolik",
    downloadButton: "Yuklab olish",
    present: "Keldi",
    absent: "Kelmadi",
    scoreLabel: "Baho",
    noLesson: "Dars yo'q",
  },
  [Langs.RU]: {
    title: "Посещаемость",
    tableHeading: "Студенты",
    noStudents: "Студенты отсутствуют",
    noStudentsMatch: "Нет студентов по запросу",
    searchPlaceholder: "Поиск по имени",
    errorFetchingData: "Ошибка загрузки данных",
    errorUpdatingData: "Ошибка сохранения посещаемости",
    downloadButton: "Скачать",
    present: "Присутствовал",
    absent: "Отсутствовал",
    scoreLabel: "Оценка",
    noLesson: "Нет урока",
  },
  [Langs.EN]: {
    title: "Attendance",
    tableHeading: "Students",
    noStudents: "No students",
    noStudentsMatch: "No students found",
    searchPlaceholder: "Search by name",
    errorFetchingData: "Failed to load data",
    errorUpdatingData: "Failed to save attendance",
    downloadButton: "Download",
    present: "Present",
    absent: "Absent",
    scoreLabel: "Score",
    noLesson: "No lesson",
  },
};

const getMonthName = (month: number, lang: Langs) => {
  const months = {
    [Langs.UZ]: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    [Langs.RU]: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    [Langs.EN]: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  };
  return months[lang][month] || "";
};

export default function TCHAttendanceTablePage() {
  const { lang } = useContext(GlobalContext);
  const t = contentsMap[lang];

  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [groupName, setGroupName] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [attRes, stuRes, groupRes, lessonRes] = await Promise.all([
          client.get(`education/attendance/?group=${id}`),
          client.get(`students/by_group/list/${id}`),
          client.get(`education/group/detail/${id}`),
          client.get(`education/lessons/?group=${id}&month=${currentMonth.format("YYYY-MM")}`),
        ]);

        setAttendanceData(attRes.data);
        setStudents(stuRes.data.filter((s: any) => s.status === "active"));
        setGroupName(groupRes.data.name);
        setLessons(lessonRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error(t.errorFetchingData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentMonth]);

  const handleAttendanceSave = async (data: {
    id?: number;
    student: number;
    lesson: number;
    date: string;
    status: boolean;
    score: number | null;
  }) => {
    try {
      let response;
      if (data.id) {
        response = await client.patch(`education/attendance/${data.id}/`, {
          status: data.status,
          score: data.score,
        });
      } else {
        response = await client.post("education/attendance/", {
          student: data.student,
          lesson: data.lesson,
          date: data.date,
          status: data.status,
          score: data.score,
        });
      }

      setAttendanceData((prev) => {
        if (data.id) {
          return prev.map((r) => (r.id === data.id ? { ...r, ...response.data } : r));
        } else {
          return [...prev, response.data];
        }
      });

      toast.success(lang === Langs.UZ ? "Saqlandi!" : lang === Langs.RU ? "Сохранено!" : "Saved!");
    } catch (err: any) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        t.errorUpdatingData;
      toast.error(msg);
    }
  };

  const downloadXLS = () => {
    const daysInMonth = currentMonth.daysInMonth();
    const dates = Array.from({ length: daysInMonth }, (_, i) =>
      currentMonth.date(i + 1)
    );

    const header = [
      "№",
      t.tableHeading,
      ...dates.map((d) => d.format("DD")),
      t.scoreLabel + " (Jami)",
    ];

    const rows: any[] = [];

    const filteredStudents = students.filter((s) => {
      const fullName = `${s.user.first_name} ${s.user.last_name || ""}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });

    filteredStudents.forEach((student, index) => {
      let totalScore = 0;
      let presentCount = 0;

      const row = [
        index + 1,
        `${student.user.first_name} ${student.user.last_name || ""}`.trim(),
      ];

      dates.forEach((date) => {
        // const dateStr = date.format("YYYY-MM-DD");
        const record = attendanceData.find(
          (r: any) =>
            r.student === student.id && dayjs(r.date).isSame(date, "day")
        );

        if (record) {
          if (record.status) {
            row.push(`+ (${record.score ?? 0})`);
            totalScore += record.score ?? 0;
            presentCount++;
          } else {
            row.push(`− (0)`);
          }
        } else {
          const hasLesson = lessons.some((l: any) =>
            dayjs(l.date).isSame(date, "day")
          );
          row.push(hasLesson ? "−" : ""); 
        }
      });

      row.push(totalScore > 0 ? totalScore : "-");
      rows.push(row);
    });

    const summaryRow = [
      "",
      "Jami kelganlar",
      ...dates.map((date) => {
        // const dateStr = date.format("YYYY-MM-DD");
        const present = attendanceData.filter((r: any) =>
          dayjs(r.date).isSame(date, "day") && r.status
        ).length;
        return present > 0 ? present : "";
      }),
      "",
    ];
    rows.push(summaryRow);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);

    ws["!cols"] = [
      { wch: 5 },
      { wch: 25 },
      ...Array(daysInMonth).fill({ wch: 10 }),
      { wch: 12 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Davomat");

    const monthName = getMonthName(currentMonth.month(), lang);
    const fileName = `${groupName || "Guruh"}_Davomat_${monthName}_${currentMonth.year()}.xlsx`;

    XLSX.writeFile(wb, fileName);
    toast.success(lang === Langs.UZ ? "Yuklab olindi!" : "Файл скачан!");
  };

  if (loading) return <Loading />;

  return (
    <div className=" ">
      <div className="w-full overflow-x-auto px-4">
        <AttendanceHeader
          groupName={groupName}
          title={t.title}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          onDownload={downloadXLS}
          searchPlaceholder={t.searchPlaceholder}
        />

        <AttendanceCalendarControls
          currentMonth={currentMonth}
          onPrev={() => setCurrentMonth((m) => m.subtract(1, "month"))}
          onNext={() => setCurrentMonth((m) => m.add(1, "month"))}
          onToday={() => setCurrentMonth(dayjs())}
          monthName={getMonthName(currentMonth.month(), lang)}
          year={currentMonth.year()}
        />

        <div className="mt-6">
          <AttendanceTableBody
            students={students}
            attendanceData={attendanceData}
            lessons={lessons}
            currentMonth={currentMonth}
            searchTerm={searchTerm}
            onSave={handleAttendanceSave}
            tableHeading={t.tableHeading}
            noStudents={t.noStudents}
            noStudentsMatch={t.noStudentsMatch}
          />
        </div>
      </div>
    </div>
  );
}