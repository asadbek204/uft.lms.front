import  { useContext, useEffect, useState, useMemo } from "react";
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
    totalPresent: "Jami kelganlar",
    totalScore: "Jami baho",
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
    totalPresent: "Всего присутствовали",
    totalScore: "Общая оценка",
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
    totalPresent: "Total Present",
    totalScore: "Total Score",
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
        console.error("❌ Fetch error:", err);
        toast.error(t.errorFetchingData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentMonth, t.errorFetchingData]);

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

    const updatedRecord = {
      ...response.data,
      student: { id: response.data.student?.id || data.student },
      lesson: { id: response.data.lesson?.id || data.lesson },
    };

    setAttendanceData((prev) => {
      const exists = prev.some((r) => r.id === updatedRecord.id);
      if (exists) {
        return prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r));
      } else {
        return [...prev, updatedRecord];
      }
    });

    toast.success("Saqlandi!");
  } catch (err: any) {
    const msg =
      err.response?.data?.non_field_errors?.[0] ||
      err.response?.data?.detail ||
      "Xatolik yuz berdi";
    toast.error(msg);
  }
};

  

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const fullName = `${s.user.first_name} ${s.user.last_name || ""}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [students, searchTerm]);

  const lessonDates = useMemo(() => {
    return lessons
      .map((l) => dayjs(l.date))
      .sort((a, b) => a.unix() - b.unix());
  }, [lessons]);

  const downloadXLS = () => {
    if (lessonDates.length === 0) {
      toast.warning("Bu oyda darslar mavjud emas!");
      return;
    }

    const header = [
      "№",
      t.tableHeading,
      ...lessonDates.map((d) => d.format("DD.MM")),
      t.totalScore,
    ];

    const rows: any[] = [];

    filteredStudents.forEach((student, index) => {
      let totalScore = 0;

      const row = [
        index + 1,
        `${student.user.first_name} ${student.user.last_name || ""}`.trim(),
      ];

      lessonDates.forEach((date) => {
        const lesson = lessons.find((l) => dayjs(l.date).isSame(date, "day"));
        
        const record = attendanceData.find((r: any) => {
          const studentId = typeof r.student === "object" ? r.student.id : r.student;
          const lessonId = typeof r.lesson === "object" ? r.lesson.id : r.lesson;
          return studentId === student.id && lessonId === lesson?.id;
        });

        if (record) {
          if (record.status) {
            const score = record.score ?? 0;
            row.push(`+ (${score})`);
            totalScore += score;
          } else {
            row.push("− (0)");
          }
        } else {
          row.push("−");
        }
      });

      row.push(totalScore > 0 ? totalScore : 0);
      rows.push(row);
    });

    const summaryRow = [
      "",
      t.totalPresent,
      ...lessonDates.map((date) => {
        const lesson = lessons.find((l) => dayjs(l.date).isSame(date, "day"));
        const present = attendanceData.filter((r: any) => {
          const lessonId = typeof r.lesson === "object" ? r.lesson.id : r.lesson;
          return lessonId === lesson?.id && r.status;
        }).length;
        return present > 0 ? present : 0;
      }),
      "",
    ];
    rows.push(summaryRow);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);

    ws["!cols"] = [
      { wch: 5 },
      { wch: 25 },
      ...Array(lessonDates.length).fill({ wch: 10 }),
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
    <div className="w-full px-4 mt-12 md:mt-0 ">
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
            lang={lang === Langs.UZ ? "uz" : lang === Langs.RU ? "ru" : "en"}
          />
        </div>
    </div>
  );
}